"use server";

import type { Hero } from "@/lib/payload-types";
import { PAGINATION_LIMIT } from "@/lib/contant";
import type { PaginatedDocs } from "@/lib/types";

export async function findHeros(page = 1, limit = PAGINATION_LIMIT): Promise<Hero[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero?limit=${limit}&page=${page}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch heroes: ${response.statusText}`);
    }

    const data = (await response.json()) as PaginatedDocs<Hero>;
    return data.docs;
  } catch (error) {
    console.error("Error fetching heroes:", error);
    return [];
  }
}
