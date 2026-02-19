import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import type { SchemaType, SingletonType } from "./schemaTypes";
import { getTitleCase } from "./utils/helper";

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  preview?: boolean;
  title?: string;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const createSingleTon = ({ S, type, title }: CreateSingleTon) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .child(S.document().schemaType(type).documentId(type));
};

type CreateList = {
  S: StructureBuilder;
} & Base;

// This function creates a list item for a type. It takes a StructureBuilder instance (S),
// a type, and a title as parameters. It generates a title for the type if not provided.
// It then returns a list item with the generated or provided title.

const createList = ({ S, type, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle);
};

type CreateIndexList = {
  S: StructureBuilder;
  list: Base;
  index: Base<SingletonType>;
  context: StructureResolverContext;
};

const createIndexListWithOrderableItems = ({
  S,
  index,
  list,
  context,
}: CreateIndexList) => {
  const indexTitle = index.title ?? getTitleCase(index.type);
  const listTitle = list.title ?? getTitleCase(list.type);
  return S.listItem()
    .title(listTitle)
    .child(
      S.list()
        .title(indexTitle)
        .items([
          S.listItem()
            .title(indexTitle)
            .child(
              S.document()
                .views([S.view.form()])
                .schemaType(index.type)
                .documentId(index.type),
            ),
          orderableDocumentListDeskItem({
            type: list.type,
            S,
            context,
            title: `${listTitle}`,
          }),
        ]),
    );
};

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  // list of all IDs manually used in list items above or in sub-menus
  const MANUAL_IDS = [
    "homePage",
    "page",
    "blog",
    "blogIndex",
    "faq",
    "author",
    "formGeneralSettings",
    "navbar",
    "footer",
    "settings",
    "assist.instruction.context", // Plugin type
    "media.tag", // Plugin type
    "sanity.videoAsset", // Plugin type
  ];

  return S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage" }),
      S.divider(),
      createList({ S, type: "page", title: "Pages" }),
      createIndexListWithOrderableItems({
        S,
        index: { type: "blogIndex" },
        list: { type: "blog", title: "Blogs" },
        context,
      }),
      createList({ S, type: "faq", title: "FAQs" }),
      createList({ S, type: "author", title: "Authors" }),

      S.divider(),

      S.listItem()
        .title("Form General Settings")
        .child(
          S.editor()
            .schemaType("formGeneralSettings")
            .documentId("form-general-settings"),
        ),

      S.listItem()
        .title("Site Configuration")
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              createSingleTon({ S, type: "navbar", title: "Navigation" }),
              createSingleTon({ S, type: "footer", title: "Footer" }),
              createSingleTon({
                S,
                type: "settings",
                title: "Global Settings",
              }),
            ]),
        ),

      S.divider(),

      // THE ONLY DYNAMIC CALL: Filters everything we handled manually above
      ...S.documentTypeListItems().filter(
        (listItem) => !MANUAL_IDS.includes(listItem.getId()!),
      ),
    ]);
};
