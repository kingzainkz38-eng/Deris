import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { ListingSummary, PortfolioItem, ProviderUser, Review } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const providerId = Number(id);

  const users = await query<ProviderUser>(
    `SELECT u.id, u.name, u.city, u.bio, u.phone, u.avatar_key, u.created_at,
            r.avg_rating, r.review_count
     FROM users u
     LEFT JOIN (
       SELECT provider_id, AVG(rating)::float as avg_rating, COUNT(*)::int as review_count
       FROM reviews
       WHERE provider_id = $1
       GROUP BY provider_id
     ) r ON true
     WHERE u.id = $1`,
    [providerId]
  );
  const user = users[0];
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  user.review_count = user.review_count || 0;

  const listings = await query<ListingSummary>(
    `SELECT l.id, l.title, l.description, l.price, l.price_type, l.city, l.image_key, l.status, l.created_at,
            u.id as user_id, u.name as user_name,
            c.slug as category_slug, c.name_en as category_name_en, c.name_so as category_name_so, c.icon as category_icon
     FROM listings l
     JOIN users u ON u.id = l.user_id
     JOIN categories c ON c.id = l.category_id
     WHERE l.user_id = $1 AND l.status = 'active'
     ORDER BY l.created_at DESC`,
    [providerId]
  );

  const portfolio = await query<PortfolioItem>(
    `SELECT id, user_id, title, description, image_key, created_at
     FROM portfolio_items WHERE user_id = $1 ORDER BY created_at DESC`,
    [providerId]
  );

  const reviews = await query<Review>(
    `SELECT rv.id, rv.provider_id, rv.reviewer_id, u.name as reviewer_name, rv.rating, rv.comment, rv.created_at
     FROM reviews rv
     JOIN users u ON u.id = rv.reviewer_id
     WHERE rv.provider_id = $1
     ORDER BY rv.created_at DESC`,
    [providerId]
  );

  const uid = await getCurrentUserId();
  const myReview = uid ? reviews.find((r) => r.reviewer_id === uid) || null : null;

  return NextResponse.json({ user, listings, portfolio, reviews, myReview });
}
