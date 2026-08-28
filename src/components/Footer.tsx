"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import { FacebookIcon, WhatsappIcon, TelegramIcon, InstagramIcon } from "./icons";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/browse" },
  { label: "Feed", href: "/feed" },
  { label: "How Deris Works", href: "/#how-it-works" },
  { label: "Become a Provider", href: "/register" },
];

const PROVIDER_LINKS = [
  { label: "Create Profile", href: "/register" },
  { label: "Provider Dashboard", href: "/dashboard" },
  { label: "Tips & Resources", href: "#" },
  { label: "Success Stories", href: "#" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const SOCIALS = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: WhatsappIcon, label: "WhatsApp" },
  { Icon: TelegramIcon, label: "Telegram" },
  { Icon: InstagramIcon, label: "Instagram" },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-16 border-t border-black/5 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-mark.png" alt="Deris" width={41} height={32} className="h-8 w-auto" />
            <span className="text-lg font-extrabold text-[var(--brand-green-dark)]">Deris</span>
          </Link>
          <p className="mt-3 max-w-[22ch] text-sm text-neutral-500">{t("footer_tagline")}</p>
        </div>

        <FooterColumn heading="Quick Links" links={QUICK_LINKS} />
        <FooterColumn heading="For Providers" links={PROVIDER_LINKS} />
        <FooterColumn heading="Support" links={SUPPORT_LINKS} />

        <div>
          <h3 className="text-sm font-bold text-neutral-900">Follow Us</h3>
          <div className="mt-4 flex items-center gap-2.5">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-green)] transition-colors hover:bg-[var(--brand-green-dark)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="mt-5">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 px-4 py-5 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Deris. {t("footer_rights")}
      </div>
    </footer>
  );
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-neutral-900">{heading}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-neutral-500 hover:text-[var(--brand-green-dark)]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
