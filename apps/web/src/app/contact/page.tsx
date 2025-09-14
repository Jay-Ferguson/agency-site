import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGE_QUERY,
  CONTACT_FORM_QUERY,
  CONTACT_FORM_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { ContactFormWrapper } from "@/components/ContactFormWrapper";

type RouteProps = {
  params: { slug: string };
};

const getPage = async (params: RouteProps["params"]) =>
  sanityFetch({
    query: PAGE_QUERY,
    params,
  });

export default async function Page({ params }: RouteProps) {
  const { data: page } = await getPage(params);
  const formId = page?.contactForm?._ref;
  const formData = formId ? await getContactForm(formId) : null;

  if (!page || !formData) {
    return <div>Not found</div>;
  }

  return (
    <>
      <ContactFormWrapper formData={formData} />
    </>
  );
}

async function getContactForm(formId: string) {
  try {
    const [formData, formSettings] = await Promise.all([
      client.fetch(CONTACT_FORM_QUERY, { formId }),
      client.fetch(CONTACT_FORM_SETTINGS_QUERY),
    ]);

    return { ...formData, settings: formSettings };
  } catch (error) {
    console.error("Error fetching contact form:", error);
    throw error;
  }
}
