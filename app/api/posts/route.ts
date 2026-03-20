import { NextRequest, NextResponse } from "next/server";
import { getAllPostsMeta } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q   = searchParams.get("q")?.toLowerCase()   ?? "";
  const tag = searchParams.get("tag")?.toLowerCase() ?? "";

  let posts = getAllPostsMeta();

  if (q) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (tag) {
    posts = posts.filter((p) =>
      p.tags.map((t) => t.toLowerCase()).includes(tag)
    );
  }

  return NextResponse.json(posts, {
    headers: { "Cache-Control": "no-store" },
  });
}
