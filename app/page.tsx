import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPostsMeta, type PostMeta } from "@/lib/posts";
import { PostSearch } from "@/components/PostSearch";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Posts",
  description: "Writing about daily life, routines, gear, and the small stuff.",
};

export default function HomePage() {
  const posts = getAllPostsMeta();
  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-label">
            {process.env.NEXT_PUBLIC_AUTHOR ?? "VENKATA NARAYANA REDDY"}
          </p>

          <h1>
            Day-Day<br />
            <span className="accent">living</span>{" "}
            <span className="dim">&amp; things I have done</span>
          </h1>

          <p className="hero-sub">
            Writing about <strong>daily habits</strong>
          </p>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">{posts.length}</div>
              <div className="hero-stat-label">posts</div>
            </div>
            <div>
              <div className="hero-stat-num">{allTags.length}</div>
              <div className="hero-stat-label">topics</div>
            </div>
            <div>
              <div className="hero-stat-num">
                {posts.reduce((a, p) => a + p.readTime, 0)}
              </div>
              <div className="hero-stat-label">min total</div>
            </div>
          </div>
        </div>
      </section>

      <div className="posts-section">
        <PostSearch allTags={allTags} />
        <p className="section-heading">all posts</p>
        <div className="posts-grid">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i === 0} />
          ))}
        </div>
      </div>
    </>
  );
}

function PostCard({ post, priority }: { post: PostMeta; priority?: boolean }) {
  const date = format(new Date(post.date), "MMM d, yyyy");
  return (
    <article className="post-card">
      <div className="post-card-cover">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
        ) : (
          <div className="post-card-cover-placeholder">// no cover</div>
        )}
      </div>
      <div className="post-card-body">
        <div className="post-card-tags">
          {post.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-meta">
          <time dateTime={post.date}>{date}</time>
          <span>·</span>
          <span>{post.readTime} min</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="read-more">read →</Link>
      </div>
    </article>
  );
}
