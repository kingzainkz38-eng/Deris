"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import type { Category } from "@/lib/types";

type FormData = {
  id?: number;
  title: string;
  description: string;
  category: string;
  priceType: "fixed" | "hourly" | "negotiable";
  price: string;
  city: string;
  imageKey: string | null;
};

const emptyData: FormData = {
  title: "",
  description: "",
  category: "",
  priceType: "fixed",
  price: "",
  city: "",
  imageKey: null,
};

export default function ListingForm({ initial }: { initial?: FormData }) {
  const { t } = useLocale();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormData>(initial || emptyData);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, imageKey: data.key }));
    } catch {
      setError(t("upload_error"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(isEdit ? `/api/listings/${initial!.id}` : "/api/listings", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "active" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/dashboard");
    } catch {
      setError(t("form_error_generic"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-neutral-500">{t("form_title_label")}</span>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={t("form_title_placeholder")}
          className="rounded-xl border border-neutral-300 px-3 py-2.5"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-neutral-500">{t("form_category_label")}</span>
        <select
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-xl border border-neutral-300 px-3 py-2.5"
        >
          <option value="" disabled>
            {t("filter_all_categories")}
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.icon} {c.name_en} / {c.name_so}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-neutral-500">{t("form_description_label")}</span>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder={t("form_description_placeholder")}
          className="rounded-xl border border-neutral-300 px-3 py-2.5"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-500">{t("form_price_type_label")}</span>
          <select
            value={form.priceType}
            onChange={(e) => setForm({ ...form, priceType: e.target.value as FormData["priceType"] })}
            className="rounded-xl border border-neutral-300 px-3 py-2.5"
          >
            <option value="fixed">{t("price_type_fixed")}</option>
            <option value="hourly">{t("price_type_hourly")}</option>
            <option value="negotiable">{t("price_type_negotiable")}</option>
          </select>
        </label>
        {form.priceType !== "negotiable" && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-500">{t("form_price_label")} (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="rounded-xl border border-neutral-300 px-3 py-2.5"
            />
          </label>
        )}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-neutral-500">{t("form_city_label")}</span>
        <input
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="rounded-xl border border-neutral-300 px-3 py-2.5"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-neutral-500">{t("form_photo_label")}</span>
        <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
        {uploading && <span className="text-xs text-neutral-400">{t("loading")}</span>}
        {form.imageKey && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.imageKey} alt="" className="mt-2 h-32 w-32 rounded-xl object-cover" />
        )}
      </label>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        disabled={saving || uploading}
        type="submit"
        className="rounded-xl bg-[var(--brand-green)] px-4 py-3 font-semibold text-white hover:bg-[var(--brand-green-dark)] disabled:opacity-60"
      >
        {saving ? t("loading") : isEdit ? t("form_submit_update") : t("form_submit_create")}
      </button>
    </form>
  );
}
