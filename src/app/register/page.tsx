"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", city: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "email_taken" ? t("register_error_exists") : t("register_error_generic"));
        return;
      }
      await refresh();
      router.push("/dashboard");
    } catch {
      setError(t("register_error_generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">{t("register_heading")}</h1>
      <p className="mt-1 text-sm text-neutral-500">{t("register_sub")}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Field label={t("field_name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field
          label={t("field_email")}
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
        />
        <Field
          label={t("field_password")}
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          required
          minLength={6}
        />
        <Field
          label={
            <>
              {t("field_phone")} <span className="text-neutral-400">({t("optional_label")})</span>
            </>
          }
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <Field
          label={
            <>
              {t("field_city")} <span className="text-neutral-400">({t("optional_label")})</span>
            </>
          }
          value={form.city}
          onChange={(v) => setForm({ ...form, city: v })}
        />

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="rounded-xl bg-[var(--brand-green)] px-4 py-3 font-semibold text-white hover:bg-[var(--brand-green-dark)] disabled:opacity-60"
        >
          {loading ? t("loading") : t("register_submit")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-500">
        {t("register_have_account")}{" "}
        <Link href="/login" className="font-semibold text-[var(--brand-green-dark)] hover:underline">
          {t("nav_login")}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}: {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-neutral-300 px-3 py-2.5 outline-none focus:border-[var(--brand-green)]"
      />
    </label>
  );
}
