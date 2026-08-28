import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { ListingDetail } from "@/lib/types";
import ListingDetailView from "@/components/ListingDetailView";

export const revalidate = 0;

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const rows = await query<ListingDetail>(
    `SELECT l.id, l.title, l.description, l.price, l.price_type, l.city, l.image_key, l.status, l.created_at,
            u.id as user_id, u.name as user_name, u.phone as user_phone, u.city as user_city, u.created_at as user_created_at,
            c.slug as category_slug, c.name_en as category_name_en, c.name_so as category_name_so, c.icon as category_icon
     FROM listings l
     JOIN users u ON u.id = l.user_id
     JOIN categories c ON c.id = l.category_id
     WHERE l.id = $1`,
    [numericId]
  );
  const listing = rows[0];
  if (!listing) notFound();

  return <ListingDetailView listing={listing} />;
}
