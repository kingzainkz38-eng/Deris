"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import ListingCard from "./ListingCard";
import ReviewForm from "./ReviewForm";
import { StarRatingDisplay } from "./StarRating";
import type { ListingSummary, PortfolioItem, ProviderUser, Review } from "@/lib/types";

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ProviderView({
  user,
  listings,
  portfolio,
  reviews,
  viewerId,
}: {
  user: ProviderUser;
  listings: ListingSummary[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  viewerId: number | null;
}) {
  const { t } = useLocale();
  const memberSince = new Date(user.created_at).getFullYear();
  const isOwner = viewerId === user.id;
  const myReview = viewerId ? reviews.find((r) => r.reviewer_id === viewerId) || null : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center sm:flex-row sm:text-left">
        {user.avatar_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_key}
            alt={user.name}
            className="h-24 w-24 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-3xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <h1 className="text-2xl font-bold text-neutral-900">{user.name}</h1>
            {isOwner && (
              <Link
                href="/dashboard/profile"
                className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Edit profile
              </Link>
            )}
          </div>
          <div className="mt-1.5 flex justify-center sm:justify-start">
            <StarRatingDisplay value={user.avg_rating} count={user.review_count} />
          </div>
          <p className="mt-1.5 text-sm text-neutral-500">
            {t("member_since")} {memberSince}
            {user.city ? ` · ${user.city}` : ""}
          </p>
          {user.bio && <p className="mt-2 max-w-xl text-neutral-700">{user.bio}</p>}
          {user.phone && (
            <a
              href={`tel:${user.phone}`}
              className="mt-3 inline-block rounded-full bg-[var(--brand-green)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green-dark)]"
            >
              📞 {user.phone}
            </a>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-xl font-bold text-neutral-900">{t("profile_listings_heading")}</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 && <p className="col-span-full text-neutral-500">{t("profile_no_listings")}</p>}
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-neutral-900">Previous Work</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.length === 0 && (
          <p className="col-span-full text-neutral-500">No previous work has been shared yet.</p>
        )}
        {portfolio.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
              {item.image_key ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_key} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">🧰</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900">{item.title}</h3>
              {item.description && <p className="mt-1 text-sm text-neutral-500">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-neutral-900">Feedback</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-3">
          {reviews.length === 0 && (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center text-neutral-500">
              No feedback yet.
            </p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-bold text-neutral-600">
                    {r.reviewer_name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{r.reviewer_name}</p>
                    <p className="text-xs text-neutral-400">{timeAgo(r.created_at)}</p>
                  </div>
                </div>
                <StarRatingDisplay value={r.rating} count={0} size="sm" showCount={false} />
              </div>
              {r.comment && <p className="mt-3 text-sm text-neutral-700">{r.comment}</p>}
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {!isOwner && viewerId && <ReviewForm providerId={user.id} existingReview={myReview} />}
          {!isOwner && !viewerId && (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
              <Link href="/login" className="font-semibold text-[var(--brand-green-dark)] hover:underline">
                Log in
              </Link>{" "}
              to leave feedback for {user.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
