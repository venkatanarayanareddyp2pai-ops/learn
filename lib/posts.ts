import fs   from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface PostMeta {
  slug:        string;
  title:       string;
  date:        string; 
  excerpt:     string;
  tags:        string[];
  coverImage?: string;
  author:      string;
  readTime:    number;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
export function getAllPostsMeta(): PostMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const raw  = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title:      data.title     ?? "Untitled",
        date:       data.date      ?? new Date().toISOString().split("T")[0],
        excerpt:    data.excerpt   ?? "",
        tags:       data.tags      ?? [],
        coverImage: data.coverImage,
        author:     data.author    ?? process.env.NEXT_PUBLIC_AUTHOR ?? "anon",
        readTime:   data.readTime  ?? 5,
      } satisfies PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
export async function getPostBySlug(slug: string): Promise<Post> {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const result = await remark()
    .use(html, { sanitize: false })
    .process(content);

  return {
    slug,
    title:       data.title     ?? "Untitled",
    date:        data.date      ?? "",
    excerpt:     data.excerpt   ?? "",
    tags:        data.tags      ?? [],
    coverImage:  data.coverImage,
    author:      data.author    ?? process.env.NEXT_PUBLIC_AUTHOR ?? "anon",
    readTime:    data.readTime  ?? 5,
    contentHtml: result.toString(),
  };
}
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostsMeta().filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}
