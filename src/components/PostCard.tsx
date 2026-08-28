"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { HeartIcon, CommentIcon, TrashIcon, SendIcon } from "./icons";
import type { PostComment, PostSummary } from "@/lib/types";

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function PostCard({
  post,
  onDeleted,
}: {
  post: PostSummary;
  onDeleted: (id: number) => void;
}) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [likeBusy, setLikeBusy] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[] | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [posting, setPosting] = useState(false);

  async function toggleLike() {
    if (!user || likeBusy) return;
    setLikeBusy(true);
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        setLiked(prevLiked);
        setLikeCount(prevCount);
      }
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setLikeBusy(false);
    }
  }

  async function loadComments() {
    setShowComments((v) => !v);
    if (comments) return;
    const res = await fetch(`/api/posts/${post.id}/comments`);
    const data = await res.json();
    setComments(data.comments || []);
  }

  async function submitComment() {
    const content = commentText.trim();
    if (!content || !user || posting) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...(prev || []), { ...data.comment, user_name: user.name }]);
        setCommentCount((c) => c + 1);
        setCommentText("");
      }
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(post.id);
  }

  const isOwner = user?.id === post.user_id;

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <Link
          href={`/provider/${post.user_id}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-lg font-bold text-white"
        >
          {post.user_name.charAt(0).toUpperCase()}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link href={`/provider/${post.user_id}`} className="font-semibold text-neutral-900 hover:underline">
              {post.user_name}
            </Link>
            {isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete post"
                className="text-neutral-400 hover:text-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-neutral-400">{timeAgo(post.created_at)}</p>

          {post.content && <p className="mt-3 whitespace-pre-wrap text-neutral-800">{post.content}</p>}

          {post.image_key && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image_key}
              alt=""
              className="mt-3 max-h-[420px] w-full rounded-xl border border-neutral-100 object-cover"
            />
          )}

          {post.listing_id && post.listing_title && (
            <Link
              href={`/listing/${post.listing_id}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-green-50)] px-3 py-1.5 text-sm font-medium text-[var(--brand-green-dark)] hover:bg-[color-mix(in_srgb,var(--brand-green-50)_70%,var(--brand-green))]"
            >
              🔗 {post.listing_title}
            </Link>
          )}

          <div className="mt-4 flex items-center gap-5 border-t border-neutral-100 pt-3 text-sm">
            <button
              type="button"
              onClick={toggleLike}
              disabled={!user}
              className={`flex items-center gap-1.5 font-medium transition-colors disabled:opacity-50 ${
                liked ? "text-red-500" : "text-neutral-500 hover:text-red-500"
              }`}
            >
              <HeartIcon className="h-5 w-5" filled={liked} />
              {likeCount > 0 ? likeCount : ""} Like{likeCount === 1 ? "" : "s"}
            </button>
            <button
              type="button"
              onClick={loadComments}
              className="flex items-center gap-1.5 font-medium text-neutral-500 hover:text-[var(--brand-green-dark)]"
            >
              <CommentIcon className="h-5 w-5" />
              {commentCount > 0 ? commentCount : ""} Comment{commentCount === 1 ? "" : "s"}
            </button>
          </div>

          {showComments && (
            <div className="mt-3 flex flex-col gap-3 border-t border-neutral-100 pt-3">
              {comments === null && <p className="text-xs text-neutral-400">Loading…</p>}
              {comments?.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600">
                    {c.user_name.charAt(0).toUpperCase()}
                  </span>
                  <div className="rounded-2xl bg-neutral-100 px-3 py-1.5">
                    <p className="text-xs font-semibold text-neutral-800">{c.user_name}</p>
                    <p className="text-sm text-neutral-700">{c.content}</p>
                  </div>
                </div>
              ))}
              {comments?.length === 0 && <p className="text-xs text-neutral-400">No comments yet.</p>}

              {user && (
                <div className="flex items-center gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitComment()}
                    placeholder="Write a comment…"
                    className="flex-1 rounded-full border border-neutral-300 px-3.5 py-2 text-sm outline-none focus:border-[var(--brand-green)]"
                  />
                  <button
                    type="button"
                    onClick={submitComment}
                    disabled={posting || !commentText.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-white disabled:opacity-50"
                    aria-label="Send comment"
                  >
                    <SendIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
