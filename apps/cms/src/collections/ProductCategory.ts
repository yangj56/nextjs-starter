import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const ProductCategory: CollectionConfig = {
  slug: "product-category",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
  },
  endpoints: [
    {
      path: "/header",
      method: "get",
      handler: async (req) => {
        const category = await req.payload.find({
          collection: "product-category",
          limit: 100,
          select: {
            title: true,
            sku: true,
            relatedProduct: true,
          },
        });
        return Response.json(category.docs);
      },
    },
    {
      path: "/:sku/products",
      method: "get",
      handler: async (req) => {
        const sku = (await req.routeParams?.sku) as string;
        if (!sku) {
          return Response.json({ error: "sku is required" }, { status: 400 });
        }
        const category = await req.payload.find({
          collection: "product-category",
          where: {
            sku: {
              equals: sku,
            },
          },
        });
        if (!category) {
          return Response.json({ error: "category not found" }, { status: 404 });
        }
        if (!category.docs.length) {
          return Response.json({ error: "category is empty" }, { status: 404 });
        }
        if (category.docs.length > 1) {
          return Response.json({ error: "category is not unique" }, { status: 404 });
        }

        const data = category.docs[0];
        if (!data) {
          return Response.json({ error: "category missing data" }, { status: 404 });
        }
        const products = await req.payload.find({
          collection: "product",
          where: {
            category: {
              equals: data.id,
            },
          },
          select: {
            color: true,
            title: true,
          },
          limit: 100,
        });
        return Response.json({
          products: products.docs,
          category: data,
        });
      },
    },
  ],
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
      required: false,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "relatedProduct",
      type: "join",
      collection: "product",
      on: "category",
    },
  ],
};
