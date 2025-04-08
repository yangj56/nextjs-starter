"use client";

import { useRouter } from "next/navigation";

export function PublishButton() {
  const router = useRouter();

  const handlePublish = async () => {
    try {
      console.log("revalidate token", `${process.env.NEXT_PUBLIC_WEB_URL}/api/revalidate`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/revalidate?token=${process.env.NEXT_PUBLIC_REVALIDATE_TOKEN}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to revalidate");
      }

      // Refresh the current route
      router.refresh();
    } catch (error) {
      console.error("Error publishing:", error);
    }
  };

  return (
    <div className="flex w-full flex-row items-end justify-end">
      <button
        onClick={handlePublish}
        className="w-[200px] rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Publish
      </button>
    </div>
  );
}
