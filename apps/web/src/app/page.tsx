import type { JSX } from "react";

import { ContactFormWrapper } from "@/components/ContactFormWrapper";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CONTACT_FORM_QUERY,
  CONTACT_FORM_SETTINGS_QUERY,
  PAGE_QUERY,
} from "@/sanity/lib/queries";

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePageData,
  });
}

export async function generateMetadata() {
  const homePageData = await fetchHomePageData();
  return await getMetaData(homePageData?.data ?? {});
}

export default async function Page(): Promise<JSX.Element> {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  return <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />;
}
