"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Services" },
  { href: "/feed", label: "Feed" },
  { href: "/#how-it-works", label: "How Deris Works" },
  { href: "/register", label: "Become a Provider" },
];

export default function Header() {
  const { user, loading, logout } = useAuth();
  const { t } = useLocale();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
        <Logo />

        <nav className="order-3 flex w-full items-center gap-6 text-sm font-medium text-neutral-700 lg:order-2 lg:w-auto">
          {NAV_LINKS.map((link, i) => {
            const isHome = link.label === "Home";
            const active = isHome ? pathname === "/" : pathname.startsWith(link.href) && link.href !== "/";
            return (
              <Link
                key={`${link.label}-${i}`}
                href={link.href}
                className={`hidden pb-1 transition-colors lg:inline ${
                  active
                    ? "border-b-2 border-[var(--brand-green)] text-[var(--brand-green-dark)]"
                    : "border-b-2 border-transparent hover:text-[var(--brand-green-dark)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/browse" className="text-neutral-700 hover:text-[var(--brand-green-dark)] lg:hidden">
            {t("nav_browse")}
          </Link>
        </nav>

        <div className="order-2 flex items-center gap-2.5 lg:order-3">
          <LanguageSwitcher />
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 sm:inline-block"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[var(--brand-green)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-green-dark)]"
              >
                Join Deris
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-neutral-700 hover:text-[var(--brand-green-dark)]">
                {t("nav_dashboard")}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {t("nav_logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
