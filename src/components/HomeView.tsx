"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import Hero from "./Hero";
import PopularCategories from "./PopularCategories";
import FeaturedProviders from "./FeaturedProviders";
import HowItWorks from "./HowItWorks";
import BecomeProviderCta from "./BecomeProviderCta";
import ListingCard from "./ListingCard";
import type { Category, FeaturedProvider, ListingSummary } from "@/lib/types";

export default function HomeView({
  listings,
  providers,
}: {
  categories: Category[];
  listings: ListingSummary[];
  providers: FeaturedProvider[];
}) {
  const { t } = useLocale();

  return (
    <div>
      <Hero />
      <PopularCategories />
      <FeaturedProviders providers={providers} />

      {listings.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{t("recent_heading")}</h2>
            <Link href="/browse" className="text-sm font-semibold text-[var(--brand-green-dark)] hover:underline">
              {t("recent_view_all")} →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <HowItWorks />
      <BecomeProviderCta />
    </div>
  );
}
