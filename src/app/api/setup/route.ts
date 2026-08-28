import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// One-time (idempotent) database initialization endpoint for the Vercel
// deployment, since there's no automatic migration runner there the way
// there is on Netlify. Protected by a secret query param so it can't be
// triggered by strangers. Safe to call more than once.
// Baked-in fallback since there's no tool-driven way to set an env var on
// this deployment ahead of time. process.env.SETUP_SECRET (if set later in
// the dashboard) takes precedence.
const FALLBACK_SETUP_SECRET = "2024ed5614f4972b7ef9cbff03344db5fee0f41382d091aa";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const expected = process.env.SETUP_SECRET || FALLBACK_SETUP_SECRET;

  if (key !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_so TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '⭐'
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      city TEXT,
      bio TEXT,
      avatar_key TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_key TEXT;`);

  await query(`
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC,
      price_type TEXT NOT NULL DEFAULT 'fixed',
      city TEXT,
      image_key TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_listings_status_created ON listings(status, created_at DESC);`);

  await query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL DEFAULT '',
      image_key TEXT,
      listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS post_likes (
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (post_id, user_id)
    );
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS post_comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);`);

  await query(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      image_key TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio_items(user_id);`);

  await query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (provider_id, reviewer_id)
    );
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);`);

  await query(`
    INSERT INTO categories (slug, name_en, name_so, icon) VALUES
      ('home-repair', 'Home Repair & Maintenance', 'Dayactirka Guriga', '🛠️'),
      ('automotive', 'Automotive Services', 'Adeegyada Baabuurta', '🚗'),
      ('cleaning', 'Cleaning Services', 'Adeegyada Nadaafadda', '🧹'),
      ('tutoring', 'Tutoring & Education', 'Waxbarasho', '📚'),
      ('it-tech', 'IT & Tech Support', 'Taageerada Tignoolajiyadda', '💻'),
      ('design-creative', 'Design & Creative', 'Naqshadaynta iyo Hal-abuurka', '🎨'),
      ('writing-translation', 'Writing & Translation', 'Qorista iyo Turjumaadda', '✍️'),
      ('events-photography', 'Events & Photography', 'Munaasabadaha iyo Sawir-qaadista', '📸'),
      ('beauty-wellness', 'Beauty & Wellness', 'Qurxinta iyo Caafimaadka', '💇'),
      ('delivery-errands', 'Delivery & Errands', 'Gaadiidka iyo Hawlaha', '🚚'),
      ('construction', 'Construction & Skilled Trades', 'Dhismaha iyo Xirfadaha', '🏗️'),
      ('business-admin', 'Business & Admin Support', 'Taageerada Ganacsiga', '📊'),
      ('other', 'Other Services', 'Adeegyo Kale', '⭐')
    ON CONFLICT (slug) DO NOTHING;
  `);

  if (searchParams.get("demo") === "1") {
    await seedDemoData();
  }

  return NextResponse.json({ ok: true, message: "Database schema is ready." });
}

type DemoUser = {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  listings: {
    category: string;
    title: string;
    description: string;
    price: number | null;
    priceType: "fixed" | "hourly" | "negotiable";
  }[];
  post: string;
  portfolio: { title: string; description: string }[];
  reviews: { from: string; rating: number; comment: string }[];
};

const DEMO_PASSWORD = "deris1234";

const DEMO_USERS: DemoUser[] = [
  {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@demo.deris",
    phone: "+252 61 234 5678",
    city: "Burco",
    bio: "Licensed electrician with 9 years of experience wiring homes and small shops across Burco.",
    listings: [
      {
        category: "home-repair",
        title: "Full home electrical wiring & repair",
        description:
          "Safe, code-compliant wiring for new builds and repairs for existing homes — sockets, breakers, lighting, and fault-finding.",
        price: 45,
        priceType: "hourly",
      },
    ],
    post: "Just finished rewiring a 3-bedroom home in Burco — new breaker panel and all sockets upgraded. Message me if your home still has old wiring, it's worth the safety check! ⚡",
    portfolio: [
      {
        title: "3-bedroom home rewire",
        description: "Full rewire including new breaker panel, sockets, and lighting circuits for a family home in Burco.",
      },
      {
        title: "Shop electrical fit-out",
        description: "Wired a new retail shop from scratch — lighting, sockets, and a dedicated circuit for refrigeration units.",
      },
    ],
    reviews: [
      { from: "khadija.omar@demo.deris", rating: 5, comment: "Ahmed rewired my salon overnight so I didn't lose a day of business. Excellent work." },
      { from: "yusuf.ibrahim@demo.deris", rating: 5, comment: "Professional, on time, and explained everything clearly. Highly recommend." },
    ],
  },
  {
    name: "Abdi Warsame",
    email: "abdi.warsame@demo.deris",
    phone: "+252 61 345 6789",
    city: "Burco",
    bio: "Phone and tablet repair specialist — screens, batteries, charging ports, water damage.",
    listings: [
      {
        category: "it-tech",
        title: "Phone screen & battery replacement",
        description: "Same-day screen and battery repair for most Android and iPhone models, with a 30-day warranty.",
        price: 20,
        priceType: "fixed",
      },
    ],
    post: "Restocked original-quality screens for the latest Samsung and iPhone models this week. Walk-ins welcome, most repairs done within the hour. 📱",
    portfolio: [
      {
        title: "Water-damage recovery",
        description: "Recovered a phone that had been dropped in water — full board clean and new charging port.",
      },
      {
        title: "Cracked screen, same-day fix",
        description: "Replaced a shattered screen and battery in under an hour while the customer waited.",
      },
    ],
    reviews: [
      { from: "faadumo.nur@demo.deris", rating: 5, comment: "Fixed my phone in 40 minutes and it works perfectly. Fair price too." },
      { from: "suleiman.ali@demo.deris", rating: 4, comment: "Good work on my tablet screen, just had to wait a bit longer than expected." },
    ],
  },
  {
    name: "Mohamed Yusuf",
    email: "mohamed.yusuf@demo.deris",
    phone: "+252 61 456 7890",
    city: "Hargeisa",
    bio: "Plumber handling leaks, installations, and full bathroom fit-outs.",
    listings: [
      {
        category: "home-repair",
        title: "Leak repair & pipe installation",
        description: "Fast response for leaking pipes, blocked drains, and new bathroom/kitchen plumbing installations.",
        price: 35,
        priceType: "hourly",
      },
    ],
    post: "Reminder: a small drip today is a burst pipe next month. Cheap fix now beats a flooded kitchen later. Booking slots open this week in Hargeisa. 🔧",
    portfolio: [
      {
        title: "Bathroom re-plumb",
        description: "Replaced all supply lines and installed a new shower and sink in a full bathroom renovation.",
      },
      {
        title: "Kitchen leak repair",
        description: "Traced and fixed a slow leak under a kitchen sink that had been causing water damage for months.",
      },
    ],
    reviews: [
      { from: "ahmed.hassan@demo.deris", rating: 5, comment: "Found the leak in minutes that two other plumbers missed. Solid work." },
      { from: "khadija.omar@demo.deris", rating: 5, comment: "Very reliable, showed up on time and cleaned up after the job." },
    ],
  },
  {
    name: "Suleiman Ali",
    email: "suleiman.ali@demo.deris",
    phone: "+252 61 567 8901",
    city: "Burco",
    bio: "Car mechanic specializing in diagnostics, brakes, and general servicing for all makes.",
    listings: [
      {
        category: "automotive",
        title: "Full car service & brake check",
        description: "Complete servicing including oil change, brake inspection, and computer diagnostics for any make or model.",
        price: 60,
        priceType: "fixed",
      },
    ],
    post: "Before your next road trip, get your brakes and fluids checked — takes 30 minutes and could save your life. Suleiman Car Care, Burco. 🚗",
    portfolio: [
      {
        title: "Brake system overhaul",
        description: "Replaced worn brake pads, rotors, and fluid on a family sedan ahead of a long road trip.",
      },
      {
        title: "Engine diagnostics & repair",
        description: "Diagnosed a persistent check-engine light and fixed a faulty sensor, restoring fuel efficiency.",
      },
    ],
    reviews: [
      { from: "abdi.warsame@demo.deris", rating: 5, comment: "Diagnosed my car's issue immediately when two other garages couldn't. Trustworthy." },
      { from: "yusuf.ibrahim@demo.deris", rating: 4, comment: "Solid brake job, fair pricing. Would go back." },
    ],
  },
  {
    name: "Faadumo Nur",
    email: "faadumo.nur@demo.deris",
    phone: "+252 61 678 9012",
    city: "Mogadishu",
    bio: "Math and English tutor for primary and secondary students, in-person or online.",
    listings: [
      {
        category: "tutoring",
        title: "Math & English tutoring (all ages)",
        description: "Patient, structured tutoring sessions tailored to your child's curriculum, with progress reports for parents.",
        price: 15,
        priceType: "hourly",
      },
    ],
    post: "Three of my students improved a full grade this term! Enrolling a few more spots for evening sessions in Mogadishu. 📚",
    portfolio: [
      {
        title: "Grade improvement — Grade 8 Math",
        description: "Tutored a struggling Grade 8 student through a full term, raising their math grade from a D to a B.",
      },
      {
        title: "English exam prep group",
        description: "Ran a 6-week English exam prep group for five students ahead of their national exams.",
      },
    ],
    reviews: [
      { from: "mohamed.yusuf@demo.deris", rating: 5, comment: "My daughter's grades improved so much this term. Patient and structured teaching." },
      { from: "khadija.omar@demo.deris", rating: 5, comment: "Great with kids and always prepared. Highly recommend for younger students." },
    ],
  },
  {
    name: "Khadija Omar",
    email: "khadija.omar@demo.deris",
    phone: "+252 61 789 0123",
    city: "Bosaso",
    bio: "Bridal and event makeup artist, also offering skincare consultations.",
    listings: [
      {
        category: "beauty-wellness",
        title: "Bridal & event makeup",
        description: "Full bridal makeup packages including trial session, plus makeup for guests and events.",
        price: 80,
        priceType: "fixed",
      },
    ],
    post: "Booking wedding season now — only a few Fridays and Saturdays left this quarter. DM me your date to check availability! 💄",
    portfolio: [
      {
        title: "Bridal makeup — Amina's wedding",
        description: "Full bridal look including trial session, airbrush foundation, and touch-ups through the reception.",
      },
      {
        title: "Graduation event makeup",
        description: "Makeup for a group of six graduates ahead of their ceremony and evening photos.",
      },
    ],
    reviews: [
      { from: "faadumo.nur@demo.deris", rating: 5, comment: "My makeup for the wedding was flawless and lasted the whole night. So talented." },
      { from: "suleiman.ali@demo.deris", rating: 5, comment: "Booked her for my sister's event — professional and punctual." },
    ],
  },
  {
    name: "Yusuf Ibrahim",
    email: "yusuf.ibrahim@demo.deris",
    phone: "+252 61 890 1234",
    city: "Burco",
    bio: "Event and portrait photographer, available for weddings, graduations, and business shoots.",
    listings: [
      {
        category: "events-photography",
        title: "Event & portrait photography",
        description: "Full-day event coverage or short portrait sessions, edited photos delivered within a week.",
        price: 120,
        priceType: "fixed",
      },
    ],
    post: "A few shots from last weekend's graduation shoot — natural light really made these pop. Booking graduation season now. 📸",
    portfolio: [
      {
        title: "Graduation portrait session",
        description: "Outdoor portrait session for a graduating student, edited and delivered within three days.",
      },
      {
        title: "Wedding day coverage",
        description: "Full-day coverage of a wedding from preparation through the reception, 400+ edited photos delivered.",
      },
    ],
    reviews: [
      { from: "ahmed.hassan@demo.deris", rating: 5, comment: "Captured our event beautifully, photos were ready faster than expected." },
      { from: "abdi.warsame@demo.deris", rating: 5, comment: "Great eye for detail, very easy to work with on the day." },
    ],
  },
];

async function seedDemoData() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const userIds: Record<string, number> = {};

  for (const demo of DEMO_USERS) {
    const rows = await query<{ id: number }>(
      `INSERT INTO users (name, email, password_hash, phone, city, bio)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [demo.name, demo.email, passwordHash, demo.phone, demo.city, demo.bio]
    );
    const userId = rows[0].id;
    userIds[demo.email] = userId;

    for (const listing of demo.listings) {
      const existing = await query<{ id: number }>(
        `SELECT id FROM listings WHERE user_id = $1 AND title = $2`,
        [userId, listing.title]
      );
      if (existing[0]) continue;

      const cat = await query<{ id: number }>(`SELECT id FROM categories WHERE slug = $1`, [listing.category]);
      if (!cat[0]) continue;

      await query(
        `INSERT INTO listings (user_id, category_id, title, description, price, price_type, city)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, cat[0].id, listing.title, listing.description, listing.price, listing.priceType, demo.city]
      );
    }

    const existingPost = await query<{ id: number }>(
      `SELECT id FROM posts WHERE user_id = $1 AND content = $2`,
      [userId, demo.post]
    );
    if (!existingPost[0]) {
      await query(`INSERT INTO posts (user_id, content) VALUES ($1, $2)`, [userId, demo.post]);
    }

    for (const item of demo.portfolio) {
      const existing = await query<{ id: number }>(
        `SELECT id FROM portfolio_items WHERE user_id = $1 AND title = $2`,
        [userId, item.title]
      );
      if (existing[0]) continue;
      await query(
        `INSERT INTO portfolio_items (user_id, title, description) VALUES ($1, $2, $3)`,
        [userId, item.title, item.description]
      );
    }
  }

  for (const demo of DEMO_USERS) {
    const providerId = userIds[demo.email];
    for (const review of demo.reviews) {
      const reviewerId = userIds[review.from];
      if (!reviewerId) continue;
      await query(
        `INSERT INTO reviews (provider_id, reviewer_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (provider_id, reviewer_id) DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment`,
        [providerId, reviewerId, review.rating, review.comment]
      );
    }
  }
}
