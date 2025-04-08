import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Hero: CollectionConfig = {
  slug: "hero",
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
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: false,
    },
    {
      name: "buttonLabel",
      type: "text",
      required: false,
    },
    {
      name: "url",
      type: "text",
      required: false,
    },
  ],
};
