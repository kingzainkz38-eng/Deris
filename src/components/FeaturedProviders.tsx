"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLocale } from "@/lib/i18n";
import { CheckBadgeIcon, PersonIcon, PinIcon } from "./icons";
import type { FeaturedProvider } from "@/lib/types";

export default function FeaturedProviders({ providers }: { providers: FeaturedProvider[] }) {
  const { locale } = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  return (
    <section id="featured-providers" className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Featured Providers</h2>
        <Link
          href="/browse"
          className="hidden items-center gap-1 text-sm font-semibold text-[var(--brand-green-dark)] hover:underline sm:inline-flex"
        >
          View All Providers <span aria-hidden>→</span>
        </Link>
      </div>

      {providers.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
          No providers yet —{" "}
          <Link href="/register" className="font-semibold text-[var(--brand-green-dark)] hover:underline">
            be the first to join Deris
          </Link>
          .
        </div>
      ) : (
        <div className="relative mt-6">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="absolute top-1/2 -left-4 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md hover:bg-neutral-50 lg:flex"
          >
            ‹
          </button>

          <div ref={scrollerRef} className="grid grid-cols-1 gap-5 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
            {providers.map((p, i) => {
              const categoryName = locale === "so" ? p.top_category_name_so : p.top_category_name_en;
              return (
                <div
                  key={p.id}
                  className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
                >
                  <div className="relative">
                    <span
                      className={`flex h-20 w-20 items-center justify-center rounded-full ${
                        i % 2 === 0 ? "bg-[var(--brand-green)]" : "bg-[var(--brand-gold)]"
                      }`}
                    >
                      <PersonIcon className="h-10 w-10 text-white/90" />
                    </span>
                    <span className="absolute -right-0.5 -bottom-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <CheckBadgeIcon className="h-5 w-5 text-[var(--brand-green)]" />
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold text-neutral-900">{p.name}</h3>
                  {categoryName && (
                    <p className="text-sm font-medium text-[var(--brand-green-dark)]">
                      {p.top_category_icon} {categoryName}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-neutral-600">
                    {p.listing_count} active listing{p.listing_count === 1 ? "" : "s"}
                  </p>
                  {p.city && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                      <PinIcon className="h-3.5 w-3.5" />
                      {p.city}
                    </div>
                  )}
                  <Link
                    href={`/provider/${p.id}`}
                    className="mt-4 w-full rounded-lg border border-[var(--brand-green)] px-4 py-2 text-sm font-semibold text-[var(--brand-green-dark)] transition-colors hover:bg-[var(--brand-green-50)]"
                  >
                    View Profile
                  </Link>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="absolute top-1/2 -right-4 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md hover:bg-neutral-50 lg:flex"
          >
            ›
          </button>
        </div>
      )}

      <Link
        href="/browse"
        className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-[var(--brand-green-dark)] hover:underline sm:hidden"
      >
        View All Providers <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
