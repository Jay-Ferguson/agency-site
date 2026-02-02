import { sanityFetch } from "@/lib/sanity/live";
import {
  querySlugPageData,
  CONTACT_FORM_QUERY,
  CONTACT_FORM_SETTINGS_QUERY,
} from "@/lib/sanity/query";
import { client } from "@/lib/sanity/client";
import { ContactFormWrapper } from "@/components/sections/ContactFormWrapper";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

const getPage = async (params: { slug: string }) =>
  sanityFetch({
    query: querySlugPageData,
    params,
  });

export default async function Page(props: RouteProps) {
  const params = await props.params;
  const { data: page } = await getPage(params);
  const formId = page?.contactForm?._ref;
  const formData = formId ? await getContactForm(formId) : null;

  if (!page || !formData) {
    return <div>Not found</div>;
  }

  return (
    <>
      <ContactFormWrapper />
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
