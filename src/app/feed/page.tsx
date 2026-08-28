import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { PostSummary } from "@/lib/types";
import FeedView from "@/components/FeedView";

export const revalidate = 0;

const POST_SELECT = `
  SELECT p.id, p.content, p.image_key, p.created_at, p.listing_id,
         u.id as user_id, u.name as user_name,
         l.title as listing_title,
         COUNT(DISTINCT pl.user_id)::int as like_count,
         COUNT(DISTINCT pc.id)::int as comment_count,
         COALESCE(bool_or(pl.user_id = $1), false) as liked_by_me
  FROM posts p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN listings l ON l.id = p.listing_id
  LEFT JOIN post_likes pl ON pl.post_id = p.id
  LEFT JOIN post_comments pc ON pc.post_id = p.id
  GROUP BY p.id, u.id, l.id
  ORDER BY p.created_at DESC
  LIMIT $2 OFFSET 0
`;

export default async function FeedPage() {
  const uid = await getCurrentUserId();
  let posts: PostSummary[] = [];

  try {
    posts = await query<PostSummary>(POST_SELECT, [uid ?? 0, 15]);
  } catch {
    // No database connected yet — render the feed empty rather than erroring.
  }

  return <FeedView initialPosts={posts} />;
}
