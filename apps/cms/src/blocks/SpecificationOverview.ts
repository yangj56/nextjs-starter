import type { Block } from "payload";

export const SpecificationOverview: Block = {
  slug: "specificationOverview",
  labels: {
    singular: "Overview Pair",
    plural: "Overview Pairs",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      label: "Label",
    },
  ],
};
