import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { clientPost } from "@/lib/sanity/client";
import { getPostHogClient } from "@/lib/posthog-server";

async function uploadResume(
  file: File,
): Promise<{ _type: "file"; asset: { _type: "reference"; _ref: string } }> {
  const asset = await clientPost.assets.upload("file", file, {
    filename: file.name,
    contentType: file.type,
  });

  return {
    _type: "file",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

// fallow-ignore-next-line complexity
async function sendEmailWithAttachment(emailData: {
  formData: { [key: string]: string };
  mailSettings: Record<string, unknown>;
}) {
  try {
    const { formData, mailSettings } = emailData;
    const resumeUrl = formData.resume;
    const fileName = resumeUrl?.split("/").pop();
    const attachments = [];

    if (resumeUrl) {
      let absoluteUrl = resumeUrl;
      if (!/^https?:\/\//i.test(resumeUrl)) {
        absoluteUrl = `https://${resumeUrl}`;
      }

      const fileBuffer = await fetch(absoluteUrl).then((res) =>
        res.arrayBuffer(),
      );
      attachments.push({
        filename: fileName || "resume.pdf",
        content: Buffer.from(fileBuffer),
        contentType: "application/pdf",
      });
    }

    const tableRows = Object.entries(formData)
      .filter(([key]) => key !== "resume" && key !== "settings")
      .map(([key, value]) => {
        return `
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>${key}</strong></td>
            <td style="padding: 8px; border: 1px solid #ccc;">${value}</td>
          </tr>
        `;
      })
      .join("");

    const htmlContent = `
      <p>${mailSettings.confirmationMessage}</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
          ${tableRows}
      </table>
      ${resumeUrl ? `<p>Resume attached: ${fileName}</p>` : ""}
    `;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: mailSettings.smtpUsername as string,
        pass: mailSettings.smtpPassword as string,
      },
    });

    await transporter.sendMail({
      from:
        "Contact Form" +
        (mailSettings.smtpUsername ? ` <${mailSettings.smtpUsername}>` : ""),
      to: mailSettings.adminEmail as string,
      subject:
        typeof mailSettings.confirmationSubject === "string"
          ? mailSettings.confirmationSubject
          : undefined,
      html: htmlContent,
      attachments,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

// fallow-ignore-next-line complexity
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Early extraction of settings and recaptchaToken
    const settingsString = formData.get("settings") as string;
    const mailSettings = settingsString ? JSON.parse(settingsString) : {};
    const recaptchaToken = formData.get("recaptchaToken") as string;

    // Verify reCAPTCHA first if enabled in settings
    if (mailSettings.recaptchaEnabled && mailSettings.recaptchaSecretKey) {
      if (!recaptchaToken) {
        return NextResponse.json(
          {
            success: false,
            recaptchaSuccess: false,
            message: "reCAPTCHA token missing",
          },
          { status: 400 },
        );
      }

      const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${mailSettings.recaptchaSecretKey}&response=${recaptchaToken}`;
      const recaptchaResponse = await fetch(verificationUrl, {
        method: "POST",
      });
      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success) {
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: "anonymous",
          event: "submit_form_recaptcha_failed",
          properties: {
            source: "submit_form_api",
          },
        });
        await posthog.shutdown();

        return NextResponse.json(
          {
            success: false,
            recaptchaSuccess: false,
            message: "reCAPTCHA verification failed",
          },
          { status: 400 },
        );
      }
    }

    // Process form data
    const formDetails: Record<string, string | File | (string | File)[]> = {};
    const fileFields: Record<string, File> = {};

    // fallow-ignore-next-line complexity
    formData.forEach((value, key) => {
      if (key === "settings" || key === "recaptchaToken" || key === "recaptcha")
        return;

      if (value instanceof File) {
        if (value.name) {
          fileFields[key] = value;
        }
        return;
      }

      if (formDetails[key]) {
        if (Array.isArray(formDetails[key])) {
          (formDetails[key] as unknown[]).push(value);
        } else {
          formDetails[key] = [formDetails[key], value];
        }
      } else {
        formDetails[key] = value;
      }
    });

    // Handle resume file upload if present
    // Dynamically find the first file field (if any)
    const fileFieldKey = Object.keys(fileFields)[0];
    const resumeFile = fileFieldKey ? fileFields[fileFieldKey] : undefined;
    const resumeFileRef =
      resumeFile instanceof File && resumeFile.name
        ? await uploadResume(resumeFile)
        : null;

    // Prepare email data
    const emailFormData: Record<string, string> = {};
    // fallow-ignore-next-line complexity
    formData.forEach((value, key) => {
      if (key === "settings" || key === "recaptchaToken" || key === "recaptcha")
        return;

      if (typeof value === "string") {
        emailFormData[key] = value;
      }
    });

    // Add resume URL if available
    if (resumeFileRef?.asset._ref) {
      const assetRef = resumeFileRef.asset._ref;
      if (assetRef.startsWith("file-")) {
        const parts = assetRef.split("-");
        const fileId = parts[1]; // The hash is always the second part
        const ext = parts[2]; // The extension is always the third part
        const resumeFileUrl = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${fileId}.${ext}`;
        emailFormData["resume"] = resumeFileUrl;
      }
    }
    // Send confirmation email
    await sendEmailWithAttachment({
      formData: emailFormData,
      mailSettings: mailSettings,
    });

    const submitterEmail = emailFormData.email ?? "anonymous";
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: submitterEmail,
      event: "submit_form_api_submitted",
      properties: {
        has_resume: Boolean(emailFormData.resume),
        field_count: Object.keys(emailFormData).length,
        source: "submit_form_api",
      },
    });
    await posthog.shutdown();

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted and email sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "anonymous",
      event: "submit_form_api_failed",
      properties: {
        error_message: error instanceof Error ? error.message : "Unknown error",
        source: "submit_form_api",
      },
    });
    await posthog.shutdown();

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit form",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
