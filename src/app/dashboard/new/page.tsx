"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";
import ListingForm from "@/components/ListingForm";

export default function NewListingPage() {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">{t("dashboard_new_listing")}</h1>
      <div className="mt-6">
        <ListingForm />
      </div>
    </div>
  );
}
