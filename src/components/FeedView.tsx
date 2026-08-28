"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import PostCard from "./PostCard";
import { ImageIcon } from "./icons";
import type { ListingSummary, PostSummary } from "@/lib/types";

export default function FeedView({ initialPosts }: { initialPosts: PostSummary[] }) {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState("");
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [myListings, setMyListings] = useState<ListingSummary[]>([]);
  const [attachListingId, setAttachListingId] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 15);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/listings?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setMyListings(d.listings || []));
  }, [user]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setImageKey(data.key);
    } finally {
      setUploading(false);
    }
  }

  async function submitPost() {
    if ((!content.trim() && !imageKey) || posting) return;
    setPosting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          imageKey,
          listingId: attachListingId || null,
        }),
      });
      const data = await res.json();
      if (res.ok && user) {
        const listing = myListings.find((l) => String(l.id) === attachListingId);
        setPosts((prev) => [
          {
            id: data.id,
            content: content.trim(),
            image_key: imageKey,
            created_at: new Date().toISOString(),
            user_id: user.id,
            user_name: user.name,
            listing_id: listing ? listing.id : null,
            listing_title: listing ? listing.title : null,
            like_count: 0,
            comment_count: 0,
            liked_by_me: false,
          },
          ...prev,
        ]);
        setContent("");
        setImageKey(null);
        setAttachListingId("");
      }
    } finally {
      setPosting(false);
    }
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?offset=${posts.length}&limit=15`);
      const data = await res.json();
      const newPosts: PostSummary[] = data.posts || [];
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length >= 15);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleDeleted(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Feed</h1>
      <p className="mt-1 text-sm text-neutral-500">Updates and work from providers across Deris.</p>

      {!loading && user && (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an update, a finished job, or a new listing…"
              rows={3}
              className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-green)]"
            />
          </div>

          {imageKey && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageKey} alt="" className="mt-3 ml-[52px] max-h-64 rounded-xl border border-neutral-100 object-cover" />
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pl-[52px]">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
                <ImageIcon className="h-4 w-4" />
                {uploading ? "Uploading…" : "Photo"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>

              {myListings.length > 0 && (
                <select
                  value={attachListingId}
                  onChange={(e) => setAttachListingId(e.target.value)}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600"
                >
                  <option value="">Attach a listing (optional)</option>
                  {myListings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="button"
              onClick={submitPost}
              disabled={posting || uploading || (!content.trim() && !imageKey)}
              className="rounded-full bg-[var(--brand-green)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green-dark)] disabled:opacity-50"
            >
              {posting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      )}

      {!loading && !user && (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
          <Link href="/register" className="font-semibold text-[var(--brand-green-dark)] hover:underline">
            Join Deris
          </Link>{" "}
          to post updates, like, and comment.
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {posts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            No posts yet — be the first to share something.
          </p>
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onDeleted={handleDeleted} />
        ))}
      </div>

      {hasMore && posts.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
