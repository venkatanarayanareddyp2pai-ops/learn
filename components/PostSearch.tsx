"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import type { PostMeta } from "@/lib/posts";

export function PostSearch({ allTags }: { allTags: string[] }) {
  const [query, setQuery]         = useState("");
  const [activeTag, setActiveTag] = useState("");

  const isActive = query.length >= 2 || activeTag !== "";
  const params   = new URLSearchParams();
  if (query)     params.set("q",   query);
  if (activeTag) params.set("tag", activeTag);

  const { data, error, isLoading } = useSWR<PostMeta[]>(
    isActive ? `/api/posts?${params}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 400 }
  );

  return (
    <div className="search-wrapper">
      <p className="search-label">
        <span className="prompt-char">$</span> filter posts
      </p>

      <div className="search-input-row">
        <span className="search-prompt">&gt;</span>
        <input
          type="search"
          className="search-input"
          placeholder="search title, excerpt, or tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search posts"
          spellCheck={false}
        />
      </div>

      {allTags.length > 0 && (
        <div className="tag-cloud">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-btn${activeTag === tag ? " active" : ""}`}
              onClick={() => setActiveTag((prev) => (prev === tag ? "" : tag))}
              aria-pressed={activeTag === tag}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {isActive && (
        <div className="search-results" role="region" aria-live="polite">
          {isLoading && (
            <p style={{ color: "var(--text-dim)", fontSize: "0.78rem" }}>
              searching…
            </p>
          )}

          {error && (
            <p style={{ color: "var(--red)", fontSize: "0.78rem" }}>
              error fetching results
            </p>
          )}

          {!isLoading && !error && data?.length === 0 && (
            <p style={{ color: "var(--text-dim)", fontSize: "0.78rem" }}>
              no results — try something else
            </p>
          )}

          {data?.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="search-result-item">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
