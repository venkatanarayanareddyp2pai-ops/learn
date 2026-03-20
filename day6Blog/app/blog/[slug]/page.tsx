import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { format } from "date-fns";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return {};

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const img  = post.coverImage ?? `${base}/og-default.png`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: img, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [img],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const date = format(new Date(post!.date), "MMMM d, yyyy");

  return (
    <article>
      <header className="post-header">
        <div className="post-header-inner">
          <div className="tags">
            {post!.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>

          <h1>{post!.title}</h1>

          <div className="post-header-meta">
            <span>{post!.author}</span>
            <span className="sep">/</span>
            <time dateTime={post!.date}>{date}</time>
            <span className="sep">/</span>
            <span>{post!.readTime} min read</span>
          </div>
        </div>
      </header>

      {post!.coverImage && (
        <div className="cover-image-wrapper">
          <Image
            src={post!.coverImage}
            alt={post!.title}
            width={720}
            height={380}
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <Link href="/" className="back-link">
        ← back to posts
      </Link>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post!.contentHtml }}
      />
    </article>
  );
}
