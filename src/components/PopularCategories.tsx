import Link from "next/link";
import {
  ToolsIcon,
  CarIcon,
  LaptopIcon,
  CapIcon,
  CameraIcon,
  ScissorsIcon,
  GridIcon,
} from "./icons";

const CATEGORIES = [
  {
    label: "Home & Repair",
    subtitle: "Electrician, Plumber, Carpenter...",
    icon: ToolsIcon,
    tint: "green",
    query: "home repair",
  },
  {
    label: "Automotive",
    subtitle: "Mechanic, Car Wash, Auto Repair...",
    icon: CarIcon,
    tint: "gold",
    query: "automotive",
  },
  {
    label: "Technology",
    subtitle: "IT Support, Web Design, Phone Repair...",
    icon: LaptopIcon,
    tint: "green",
    query: "technology",
  },
  {
    label: "Education",
    subtitle: "Tutors, Language, Training...",
    icon: CapIcon,
    tint: "gold",
    query: "education",
  },
  {
    label: "Media",
    subtitle: "Photography, Video, Editing...",
    icon: CameraIcon,
    tint: "green",
    query: "media",
  },
  {
    label: "Beauty",
    subtitle: "Barber, Makeup, Salon...",
    icon: ScissorsIcon,
    tint: "gold",
    query: "beauty",
  },
] as const;

const tintClasses: Record<string, string> = {
  green: "bg-[var(--brand-green-50)] text-[var(--brand-green)]",
  gold: "bg-[color-mix(in_srgb,var(--brand-gold)_16%,white)] text-[var(--brand-gold-dark)]",
};

export default function PopularCategories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">Popular Categories</h2>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {CATEGORIES.map((c) => (
          <Link
            key={c.label}
            href={`/browse?q=${encodeURIComponent(c.query)}`}
            className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--brand-green)] hover:shadow-md"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tintClasses[c.tint]}`}>
              <c.icon className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold text-neutral-900">{c.label}</span>
            <span className="text-xs leading-snug text-neutral-500">{c.subtitle}</span>
          </Link>
        ))}

        <Link
          href="/browse"
          className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--brand-green)] hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-green-50)] text-[var(--brand-green)]">
            <GridIcon className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold text-neutral-900">View All</span>
          <span className="text-xs leading-snug text-neutral-500">Explore all categories</span>
        </Link>
      </div>

      <div className="mt-9 flex justify-center">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--brand-green)] px-6 py-2.5 text-sm font-semibold text-[var(--brand-green-dark)] transition-colors hover:bg-[var(--brand-green-50)]"
        >
          Explore All Services
          <span aria-hidden>›</span>
        </Link>
      </div>
    </section>
  );
}
