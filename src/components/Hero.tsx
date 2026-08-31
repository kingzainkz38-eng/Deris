import SearchBar from "./SearchBar";
import HeroSlideshow from "./HeroSlideshow";
import { CheckBadgeIcon, ChatIcon, UsersIcon } from "./icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[color-mix(in_srgb,var(--brand-green-50)_60%,white)] to-white pt-12 pb-24 sm:pt-16">
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[color-mix(in_srgb,var(--brand-gold)_18%,white)] blur-3xl" />
      <div className="pointer-events-none absolute top-20 -left-24 h-72 w-72 rounded-full bg-[var(--brand-green-50)] blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-green-50)] px-3.5 py-1.5 text-xs font-semibold text-[var(--brand-green-dark)]">
            <UsersIcon className="h-4 w-4" />
            Welcome to Deris
          </span>

          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            Find the right person for the <span className="text-[var(--brand-green)]">job.</span>
          </h1>

          <p className="max-w-md text-lg text-neutral-500">
            Discover trusted local service providers and get the job done.
          </p>

          <div className="w-full max-w-xl">
            <SearchBar />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-sm font-medium text-neutral-600">
            <span className="flex items-center gap-1.5">
              <CheckBadgeIcon className="h-4 w-4 text-[var(--brand-green)]" />
              Trusted Providers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckBadgeIcon className="h-4 w-4 text-[var(--brand-gold)]" />
              Verified Profiles
            </span>
            <span className="flex items-center gap-1.5">
              <ChatIcon className="h-4 w-4 text-[var(--brand-green)]" />
              Easy to Connect
            </span>
          </div>
        </div>

        <HeroSlideshow />
      </div>

      <svg
        className="absolute right-0 bottom-0 left-0 h-16 w-full text-[var(--brand-gold)] sm:h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 70 C 360 10, 1080 110, 1440 40 L1440 100 L0 100 Z" fill="url(#hero-wave)" />
        <defs>
          <linearGradient id="hero-wave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand-green)" />
            <stop offset="1" stopColor="var(--brand-gold)" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
}
