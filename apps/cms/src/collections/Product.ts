import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Product: CollectionConfig = {
  slug: "product",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "sku",
      label: "SKU (no space or special characters *unique)",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "product-category",
      required: true,
    },
    {
      name: "color",
      type: "array",
      fields: [
        {
          name: "colorName",
          label: "Color name",
          type: "text",
        },
        {
          name: "colorCode",
          label: "Color Code (eg: #000000)",
          type: "text",
        },
        {
          name: "images",
          type: "array",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
          ],
        },
      ],
    },
    {
      name: "datasheet",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "instruction",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "youtubeUrl",
      type: "text",
      required: true,
    },
    {
      name: "specificationOverviewInfo",
      type: "array",
      fields: [
        {
          name: "data",
          type: "text",
        },
      ],
    },
    {
      name: "labelValuePairs",
      type: "json",
    },
    {
      name: "compatibleProducts",
      type: "array",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "product",
        },
      ],
    },
  ],
};
