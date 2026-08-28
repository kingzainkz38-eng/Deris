"use client";

import Link from "next/link";
import { useLocale, type DictKey } from "@/lib/i18n";
import type { ListingSummary } from "@/lib/types";

function formatPrice(l: ListingSummary, t: (k: DictKey) => string) {
  if (l.price_type === "negotiable" || l.price == null) return t("price_negotiable");
  const amount = Number(l.price);
  const formatted = `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return l.price_type === "hourly" ? `${formatted}${t("price_hour_suffix")}` : formatted;
}

export default function ListingCard({ listing }: { listing: ListingSummary }) {
  const { t, locale } = useLocale();
  const categoryName = locale === "so" ? listing.category_name_so : listing.category_name_en;

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {listing.image_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.image_key}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">{listing.category_icon}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[var(--brand-green-50)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-green-dark)]">
          {listing.category_icon} {categoryName}
        </span>
        <h3 className="line-clamp-2 font-semibold text-neutral-900">{listing.title}</h3>
        <p className="line-clamp-2 text-sm text-neutral-500">{listing.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-[var(--brand-green-dark)]">{formatPrice(listing, t)}</span>
          {listing.city && <span className="text-xs text-neutral-400">{listing.city}</span>}
        </div>
      </div>
    </Link>
  );
}
