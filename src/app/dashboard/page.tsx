"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";
import type { ListingSummary } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t, locale } = useLocale();
  const router = useRouter();
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/listings?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .finally(() => setFetching(false));
  }, [user]);

  async function toggleStatus(listing: ListingSummary) {
    const nextStatus = listing.status === "active" ? "paused" : "active";
    await fetch(`/api/listings/${listing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: listing.title,
        description: listing.description,
        category: listing.category_slug,
        priceType: listing.price_type,
        price: listing.price,
        city: listing.city,
        status: nextStatus,
      }),
    });
    setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, status: nextStatus } : l)));
  }

  async function deleteListing(id: number) {
    if (!confirm(t("dashboard_delete_confirm"))) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t("dashboard_heading")}</h1>
          <p className="text-sm text-neutral-500">{t("dashboard_sub")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/profile"
            className="rounded-full border border-neutral-300 px-5 py-2.5 font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Edit profile
          </Link>
          <Link
            href="/dashboard/new"
            className="rounded-full bg-[var(--brand-green)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--brand-green-dark)]"
          >
            + {t("dashboard_new_listing")}
          </Link>
        </div>
      </div>

      {!fetching && listings.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
          {t("dashboard_no_listings")}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {listings.map((l) => (
          <div
            key={l.id}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 text-2xl">
                {l.image_key ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.image_key} alt="" className="h-full w-full object-cover" />
                ) : (
                  l.category_icon
                )}
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{l.title}</p>
                <p className="text-xs text-neutral-500">
                  {locale === "so" ? l.category_name_so : l.category_name_en}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  l.status === "active" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {l.status === "active" ? t("dashboard_status_active") : t("dashboard_status_paused")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => toggleStatus(l)}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 font-medium text-neutral-600 hover:bg-neutral-50"
              >
                {l.status === "active" ? t("dashboard_pause") : t("dashboard_activate")}
              </button>
              <Link
                href={`/dashboard/edit/${l.id}`}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 font-medium text-neutral-600 hover:bg-neutral-50"
              >
                {t("dashboard_edit")}
              </Link>
              <button
                onClick={() => deleteListing(l.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50"
              >
                {t("dashboard_delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
