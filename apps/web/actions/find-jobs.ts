"use server";

import type { Job } from "@/lib/payload-types";
import { PAGINATION_LIMIT } from "@/lib/contant";
import type { PaginatedDocs } from "@/lib/types";

export async function findJobs(page = 1, limit = PAGINATION_LIMIT): Promise<Job[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/api/job?limit=${limit}&page=${page}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data = (await response.json()) as PaginatedDocs<Job>;
    return data.docs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}
