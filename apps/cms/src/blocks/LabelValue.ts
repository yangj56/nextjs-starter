import type { Block } from "payload";

export const LabelValue: Block = {
  slug: "labelValue",
  labels: {
    singular: "Label-Value Pair",
    plural: "Label-Value Pairs",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      label: "Label",
    },
    {
      name: "value",
      type: "text",
      required: true,
      label: "Value",
    },
  ],
};
