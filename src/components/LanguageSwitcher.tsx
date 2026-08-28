"use client";

import { useLocale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center rounded-full border border-neutral-300 p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          locale === "en" ? "bg-[var(--brand-green)] text-white" : "text-neutral-600"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("so")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          locale === "so" ? "bg-[var(--brand-green)] text-white" : "text-neutral-600"
        }`}
      >
        SO
      </button>
    </div>
  );
}
