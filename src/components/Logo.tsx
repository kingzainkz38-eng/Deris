import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex shrink-0 items-center gap-2 ${className}`}>
      <Image src="/logo-mark.png" alt="Deris" width={46} height={36} className="h-9 w-auto" priority />
      <span className="text-2xl font-extrabold tracking-tight text-[var(--brand-green-dark)]">Deris</span>
    </Link>
  );
}
