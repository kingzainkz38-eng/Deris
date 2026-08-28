"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLocale } from "@/lib/i18n";
import ListingCard from "./ListingCard";
import type { Category, ListingSummary } from "@/lib/types";

export default function BrowseView({
  categories,
  listings,
  initialQuery,
  initialCategory,
  initialCity,
}: {
  categories: Category[];
  listings: ListingSummary[];
  initialQuery: string;
  initialCategory: string;
  initialCity: string;
}) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);

  function applyFilters(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    if (category) params.set("category", category);
    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">{t("browse_heading")}</h1>

      <form
        onSubmit={applyFilters}
        className="mt-6 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-neutral-500">{t("filter_keyword_label")}</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("filter_keyword_placeholder")}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-500">{t("filter_category_label")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 sm:w-56"
          >
            <option value="">{t("filter_all_categories")}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.icon} {locale === "so" ? c.name_so : c.name_en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-500">{t("filter_city_label")}</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("filter_city_placeholder")}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 sm:w-40"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-[var(--brand-green)] px-5 py-2 font-semibold text-white hover:bg-[var(--brand-green-dark)]"
        >
          {t("filter_apply")}
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-500">
        {listings.length} {t("results_count_suffix")}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
            {t("no_results")}
          </p>
        )}
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
