"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLocale } from "@/lib/i18n";
import { SearchIcon, PinIcon, ChevronDownIcon } from "./icons";

const CITIES = ["Burco", "Mogadishu", "Hargeisa", "Bosaso", "Kismayo", "Baidoa"];

export default function SearchBar({
  initialQuery = "",
  initialCity = "Burco",
}: {
  initialQuery?: string;
  initialCity?: string;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-black/5 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 px-3 py-2.5">
        <SearchIcon className="h-5 w-5 shrink-0 text-neutral-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search_placeholder")}
          className="w-full min-w-0 text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </div>
      <div className="hidden h-6 w-px bg-neutral-200 sm:block" />
      <div className="relative flex items-center gap-2 px-3 py-2.5 sm:w-40">
        <PinIcon className="h-5 w-5 shrink-0 text-neutral-400" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full appearance-none bg-transparent text-neutral-900 outline-none"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-neutral-400" />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-green)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--brand-green-dark)]"
      >
        Find a Service
      </button>
    </form>
  );
}
