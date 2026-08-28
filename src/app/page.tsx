import { query } from "@/lib/db";
import type { Category, FeaturedProvider, ListingSummary } from "@/lib/types";
import HomeView from "@/components/HomeView";

export const revalidate = 0;

export default async function Home() {
  let categories: Category[] = [];
  let listings: ListingSummary[] = [];
  let providers: FeaturedProvider[] = [];

  try {
    categories = await query<Category>(
      `SELECT id, slug, name_en, name_so, icon FROM categories ORDER BY name_en`
    );
    listings = await query<ListingSummary>(
      `SELECT l.id, l.title, l.description, l.price, l.price_type, l.city, l.image_key, l.status, l.created_at,
              u.id as user_id, u.name as user_name,
              c.slug as category_slug, c.name_en as category_name_en, c.name_so as category_name_so, c.icon as category_icon
       FROM listings l
       JOIN users u ON u.id = l.user_id
       JOIN categories c ON c.id = l.category_id
       WHERE l.status = 'active'
       ORDER BY l.created_at DESC
       LIMIT 8`
    );
    providers = await query<FeaturedProvider>(
      `SELECT u.id, u.name, u.city,
              counts.listing_count,
              cat.name_en as top_category_name_en,
              cat.name_so as top_category_name_so,
              cat.icon as top_category_icon
       FROM users u
       JOIN (
         SELECT user_id, COUNT(*)::int as listing_count
         FROM listings WHERE status = 'active'
         GROUP BY user_id
       ) counts ON counts.user_id = u.id
       JOIN LATERAL (
         SELECT c.name_en, c.name_so, c.icon
         FROM listings l
         JOIN categories c ON c.id = l.category_id
         WHERE l.user_id = u.id AND l.status = 'active'
         ORDER BY l.created_at DESC
         LIMIT 1
       ) cat ON true
       ORDER BY counts.listing_count DESC, u.id DESC
       LIMIT 4`
    );
  } catch {
    // No database connected yet (e.g. local dev without DATABASE_URL) — render
    // the homepage without the dynamic "recently posted" listings section.
  }

  return <HomeView categories={categories} listings={listings} providers={providers} />;
}
