"use client";

import Link from "next/link";
import { useLocale, type DictKey } from "@/lib/i18n";
import type { ListingDetail } from "@/lib/types";

function formatPrice(l: ListingDetail, t: (k: DictKey) => string) {
  if (l.price_type === "negotiable" || l.price == null) return t("price_negotiable");
  const amount = Number(l.price);
  const formatted = `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return l.price_type === "hourly" ? `${formatted}${t("price_hour_suffix")}` : formatted;
}

export default function ListingDetailView({ listing }: { listing: ListingDetail }) {
  const { t, locale } = useLocale();
  const categoryName = locale === "so" ? listing.category_name_so : listing.category_name_en;
  const memberSince = new Date(listing.user_created_at).getFullYear();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/browse" className="text-sm font-medium text-[var(--brand-green-dark)] hover:underline">
        ← {t("back_to_results")}
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
            {listing.image_key ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.image_key} alt={listing.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl">{listing.category_icon}</div>
            )}
          </div>

          <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-[var(--brand-green-50)] px-3 py-1 text-sm font-medium text-[var(--brand-green-dark)]">
            {listing.category_icon} {categoryName}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">{listing.title}</h1>
          <p className="mt-1 text-xl font-bold text-[var(--brand-green-dark)]">{formatPrice(listing, t)}</p>
          {listing.city && <p className="mt-1 text-sm text-neutral-500">{listing.city}</p>}

          <h2 className="mt-6 text-lg font-semibold text-neutral-900">{t("listing_description_heading")}</h2>
          <p className="mt-2 whitespace-pre-wrap text-neutral-700">{listing.description}</p>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{t("contact_heading")}</h2>
            <Link href={`/provider/${listing.user_id}`} className="mt-3 block text-lg font-bold text-neutral-900 hover:underline">
              {listing.user_name}
            </Link>
            <p className="text-sm text-neutral-500">
              {t("member_since")} {memberSince}
            </p>
            {listing.user_city && <p className="mt-1 text-sm text-neutral-500">{listing.user_city}</p>}

            <div className="mt-4 flex flex-col gap-2">
              {listing.user_phone && (
                <a
                  href={`tel:${listing.user_phone}`}
                  className="rounded-xl bg-[var(--brand-green)] px-4 py-2.5 text-center font-semibold text-white hover:bg-[var(--brand-green-dark)]"
                >
                  📞 {listing.user_phone}
                </a>
              )}
              <Link
                href={`/provider/${listing.user_id}`}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-center font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                {t("view_profile")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
