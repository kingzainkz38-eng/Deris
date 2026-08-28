"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRatingInput } from "./StarRating";
import type { Review } from "@/lib/types";

export default function ReviewForm({
  providerId,
  existingReview,
}: {
  providerId: number;
  existingReview: Review | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/providers/${providerId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "cannot_review_self" ? "You can't review your own profile." : "Something went wrong.");
        return;
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete your review?")) return;
    setSaving(true);
    try {
      await fetch(`/api/providers/${providerId}/reviews`, { method: "DELETE" });
      setRating(0);
      setComment("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <h3 className="font-semibold text-neutral-900">{existingReview ? "Your review" : "Leave a review"}</h3>
      <div className="mt-3">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share how the job went…"
        className="mt-3 w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-green)]"
      />
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="rounded-full bg-[var(--brand-green)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green-dark)] disabled:opacity-50"
        >
          {saving ? "Saving…" : existingReview ? "Update review" : "Submit review"}
        </button>
        {existingReview && (
          <button
            type="button"
            onClick={remove}
            disabled={saving}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
