"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";
import ListingForm from "@/components/ListingForm";
import type { ListingDetail } from "@/lib/types";

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.listing) {
          setNotFoundFlag(true);
          return;
        }
        setListing(d.listing);
      });
  }, [id]);

  if (loading || !user) return null;
  if (notFoundFlag) return <p className="mx-auto max-w-xl px-4 py-10 text-neutral-500">{t("not_found")}</p>;
  if (!listing) return null;
  if (listing.user_id !== user.id) {
    return <p className="mx-auto max-w-xl px-4 py-10 text-neutral-500">{t("forbidden")}</p>;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">{t("dashboard_edit")}</h1>
      <div className="mt-6">
        <ListingForm
          initial={{
            id: listing.id,
            title: listing.title,
            description: listing.description,
            category: listing.category_slug,
            priceType: listing.price_type,
            price: listing.price != null ? String(listing.price) : "",
            city: listing.city || "",
            imageKey: listing.image_key,
          }}
        />
      </div>
    </div>
  );
}
