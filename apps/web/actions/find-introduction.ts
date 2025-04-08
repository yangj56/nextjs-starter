"use server";

import type { Introduction } from "@/lib/payload-types";
import type { PaginatedDocs } from "@/lib/types";

export async function findIntroduction(): Promise<Introduction | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/api/introduction`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch introduction: ${response.statusText}`);
    }

    const data = (await response.json()) as PaginatedDocs<Introduction>;
    const latestIntroduction = data.docs.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
    return latestIntroduction || null;
  } catch (error) {
    console.error("Error fetching introduction:", error);
    return null;
  }
}
