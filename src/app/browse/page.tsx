import { query } from "@/lib/db";
import type { Category, ListingSummary } from "@/lib/types";
import BrowseView from "@/components/BrowseView";

export const revalidate = 0;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string }>;
}) {
  const sp = await searchParams;

  const categories = await query<Category>(
    `SELECT id, slug, name_en, name_so, icon FROM categories ORDER BY name_en`
  );

  const conditions: string[] = [`l.status = 'active'`];
  const params: unknown[] = [];

  if (sp.q) {
    params.push(`%${sp.q}%`);
    conditions.push(`(l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`);
  }
  if (sp.category) {
    params.push(sp.category);
    conditions.push(`c.slug = $${params.length}`);
  }
  if (sp.city) {
    params.push(`%${sp.city}%`);
    conditions.push(`l.city ILIKE $${params.length}`);
  }

  const listings = await query<ListingSummary>(
    `SELECT l.id, l.title, l.description, l.price, l.price_type, l.city, l.image_key, l.status, l.created_at,
            u.id as user_id, u.name as user_name,
            c.slug as category_slug, c.name_en as category_name_en, c.name_so as category_name_so, c.icon as category_icon
     FROM listings l
     JOIN users u ON u.id = l.user_id
     JOIN categories c ON c.id = l.category_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY l.created_at DESC
     LIMIT 60`,
    params
  );

  return (
    <BrowseView
      categories={categories}
      listings={listings}
      initialQuery={sp.q || ""}
      initialCategory={sp.category || ""}
      initialCity={sp.city || ""}
    />
  );
}
