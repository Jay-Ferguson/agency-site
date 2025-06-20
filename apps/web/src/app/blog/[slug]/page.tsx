import { notFound } from "next/navigation";
import type { PortableTextBlock } from "next-sanity";
import type { ReactElement } from "react";

import { RichText } from "@/components/richtext";
import { SanityImage } from "@/components/sanity-image";
import { TableOfContent } from "@/components/table-of-content";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogPaths, queryBlogSlugPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { handleErrors } from "@/utils";

type BlogSlugPageData = {
  data?: {
    title?: string;
    description?: string;
    image?: string | null | any; // Adjust type based on your image structure
    richText?: PortableTextBlock[];
    // Add other fields as needed
  };
};

async function fetchBlogSlugPageData(
  slug: string,
): Promise<[BlogSlugPageData, unknown]> {
  const response: any = await handleErrors(
    sanityFetch({
      query: queryBlogSlugPageData,
      params: { slug: `/blog/${slug}` },
    }),
  );
  return [response, undefined as unknown];
  // Handle errors if needed, e.g., return [undefined, error] if an error occurs
  // For simplicity, this example assumes the fetch is always successful
  // You can add error handling logic as per your requirements
  // e.g., if the response is null or undefined, return notFound() or an error object
  // return response ? [response, undefined] : [undefined, new Error("Not found")];
}

async function fetchBlogPaths() {
  const slugs = await client.fetch(queryBlogPaths);
  const paths: { slug: string }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const [, , path] = slug.split("/");
    if (path) paths.push({ slug: path });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [res, err] = await fetchBlogSlugPageData(slug);
  if (err || !res?.data) return {};
  return await getMetaData(res.data ?? {});
}

export async function generateStaticParams() {
  return await fetchBlogPaths();
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ReactElement> {
  const { slug } = await params;
  const [res, err] = await fetchBlogSlugPageData(slug);
  if (err || !res?.data) return notFound();
  const { title, description, image, richText } = res.data ?? {};

  // Cast richText to RichText type
  const typedRichText: PortableTextBlock[] | undefined = richText as
    | PortableTextBlock[]
    | undefined;

  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <header className="mb-8">
            <h1 className="mt-2 text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          </header>
          {image && (
            <div className="mb-12">
              <SanityImage
                asset={image}
                alt={title}
                width={1600}
                loading="eager"
                priority
                height={900}
                className="rounded-lg h-auto w-full"
              />
            </div>
          )}
          <RichText richText={richText ?? []} />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-4 rounded-lg ">
            <TableOfContent richText={typedRichText} />
          </div>
        </aside>
      </div>
    </div>
  );
}
