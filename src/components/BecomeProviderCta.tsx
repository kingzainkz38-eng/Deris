import Link from "next/link";
import { UserPlusIcon, ArrowRightIcon } from "./icons";

export default function BecomeProviderCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-gradient-to-r from-[var(--brand-green-dark)] via-[var(--brand-green)] to-[var(--brand-gold)] px-6 py-8 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
            <UserPlusIcon className="h-6 w-6 text-[var(--brand-green-dark)]" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">Have a skill? Turn it into income.</h2>
            <p className="mt-1 text-sm text-white/90">Join hundreds of service providers on Deris and grow your business.</p>
          </div>
        </div>
        <Link
          href="/register"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-green-dark)] transition-transform hover:scale-[1.03]"
        >
          Become a Provider
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
