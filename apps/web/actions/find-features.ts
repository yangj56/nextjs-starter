"use server";

import type { Feature } from "@/lib/payload-types";
import { PAGINATION_LIMIT } from "@/lib/contant";
import type { PaginatedDocs } from "@/lib/types";

export async function findFeatures(page = 1, limit = PAGINATION_LIMIT): Promise<Feature[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/api/feature?limit=${limit}&page=${page}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch features: ${response.statusText}`);
    }

    const data = (await response.json()) as PaginatedDocs<Feature>;
    return data.docs;
  } catch (error) {
    console.error("Error fetching features:", error);
    return [];
  }
}
