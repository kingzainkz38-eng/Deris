export type Category = {
  id: number;
  slug: string;
  name_en: string;
  name_so: string;
  icon: string;
};

export type ListingSummary = {
  id: number;
  title: string;
  description: string;
  price: string | number | null;
  price_type: "fixed" | "hourly" | "negotiable";
  city: string | null;
  image_key: string | null;
  status: string;
  created_at: string;
  user_id: number;
  user_name: string;
  category_slug: string;
  category_name_en: string;
  category_name_so: string;
  category_icon: string;
};

export type ListingDetail = ListingSummary & {
  user_phone: string | null;
  user_city: string | null;
  user_created_at: string;
};

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  avatar_key: string | null;
  created_at: string;
};

export type ProviderUser = {
  id: number;
  name: string;
  city: string | null;
  bio: string | null;
  phone: string | null;
  avatar_key: string | null;
  created_at: string;
  avg_rating: number | null;
  review_count: number;
};

export type PortfolioItem = {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  image_key: string | null;
  created_at: string;
};

export type Review = {
  id: number;
  provider_id: number;
  reviewer_id: number;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type FeaturedProvider = {
  id: number;
  name: string;
  city: string | null;
  listing_count: number;
  top_category_name_en: string | null;
  top_category_name_so: string | null;
  top_category_icon: string | null;
};

export type PostSummary = {
  id: number;
  content: string;
  image_key: string | null;
  created_at: string;
  user_id: number;
  user_name: string;
  listing_id: number | null;
  listing_title: string | null;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
};

export type PostComment = {
  id: number;
  post_id: number;
  content: string;
  created_at: string;
  user_id: number;
  user_name: string;
};
