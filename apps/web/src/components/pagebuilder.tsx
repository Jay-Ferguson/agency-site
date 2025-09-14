"use client";
import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute, type SanityDocument } from "next-sanity";
import type { ComponentType } from "react";

import { dataset, projectId, studioUrl } from "@/lib/sanity/api";
import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import type { PagebuilderType } from "@/types";

import { CTABlock } from "./sections/cta";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { HeroBlock } from "./sections/hero";
import { ImageLinkCards } from "./sections/image-link-cards";
import ReadingTime from "./sections/readingTime";
import { SubscribeNewsletter } from "./sections/subscribe-newsletter";

type PageBlock = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number];

type BlockType = keyof typeof BLOCK_COMPONENTS | "readingTime";

export type PageBuilderProps = {
  pageBuilder: PageBlockExtended[];
  id: string;
  type: string;
};

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBlock[];
};

// Extend PageBlock to include readingTime block
type ReadingTimeBlock = {
  _type: "readingTime";
  _key: string;
  text: string;
};

type PageBlockExtended = PageBlock | ReadingTimeBlock;

const BLOCK_COMPONENTS = {
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
  readingTime: ReadingTime, // Added ReadingTime block
} as const;

export function PageBuilder({
  pageBuilder: initialPageBuilder = [],
  id,
  type,
}: PageBuilderProps) {
  const pageBuilder = useOptimistic<
    PageBlockExtended[],
    SanityDocument<PageData>
  >(initialPageBuilder, (currentPageBuilder, action) => {
    if (action.id === id && action.document.pageBuilder) {
      return action.document.pageBuilder;
    }
    return currentPageBuilder;
  });

  return (
    <main
      className="flex flex-col gap-16 my-16 max-w-7xl mx-auto"
      data-sanity={createDataAttribute({
        id: id,
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: type,
        path: "pageBuilder",
      }).toString()}
    >
      {pageBuilder.map((block) => {
        if (block._type === "readingTime") {
          // Type assertion for ReadingTimeBlock
          const readingBlock = block as ReadingTimeBlock;
          return (
            <div
              key={`${readingBlock._type}-${readingBlock._key}`}
              data-sanity={createDataAttribute({
                id: id,
                baseUrl: studioUrl,
                projectId: projectId,
                dataset: dataset,
                type: type,
                path: `pageBuilder[_key=="${readingBlock._key}"]`,
              }).toString()}
            >
              <ReadingTime text={readingBlock.text || ""} />
            </div>
          );
        }
        // Standard blocks
        const Component = BLOCK_COMPONENTS[
          block._type as BlockType
        ] as ComponentType<any>;
        if (!Component) {
          return (
            <div
              key={`${block._type}-${(block as any)._key}`}
              className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg"
            >
              Component not found for block type: <code>{block._type}</code>
            </div>
          );
        }
        return (
          <div
            key={`${block._type}-${(block as any)._key}`}
            data-sanity={createDataAttribute({
              id: id,
              baseUrl: studioUrl,
              projectId: projectId,
              dataset: dataset,
              type: type,
              path: `pageBuilder[_key=="${(block as any)._key}"]`,
            }).toString()}
          >
            <Component {...block} />
          </div>
        );
      })}
    </main>
  );
}
