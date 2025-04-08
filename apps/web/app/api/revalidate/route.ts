import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    console.log("token", token);
    if (token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    revalidatePath("/", "layout");

    return NextResponse.json(
      { revalidated: true, message: "Revalidation triggered successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
