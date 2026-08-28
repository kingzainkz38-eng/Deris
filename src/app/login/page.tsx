"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError(t("login_error"));
        return;
      }
      await refresh();
      router.push("/dashboard");
    } catch {
      setError(t("login_error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">{t("login_heading")}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-500">{t("field_email")}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-neutral-300 px-3 py-2.5 outline-none focus:border-[var(--brand-green)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-500">{t("field_password")}</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-neutral-300 px-3 py-2.5 outline-none focus:border-[var(--brand-green)]"
          />
        </label>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="rounded-xl bg-[var(--brand-green)] px-4 py-3 font-semibold text-white hover:bg-[var(--brand-green-dark)] disabled:opacity-60"
        >
          {loading ? t("loading") : t("login_submit")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-500">
        {t("login_no_account")}{" "}
        <Link href="/register" className="font-semibold text-[var(--brand-green-dark)] hover:underline">
          {t("nav_register")}
        </Link>
      </p>
    </div>
  );
}
