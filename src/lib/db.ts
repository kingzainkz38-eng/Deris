import { Pool } from "pg";

let _pool: Pool | null = null;

function getConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

function pool(connectionString: string): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return _pool;
}

// Local development has no cloud Postgres connected, so we fall back to an
// embedded Postgres (PGlite, real Postgres compiled to WASM) persisted to
// disk. Same SQL dialect as the `pg`/Vercel Postgres path used in
// production, so queries don't need to branch on which backend is active.
//
// PGlite owns its data directory exclusively — two instances pointed at the
// same directory from the same process see stale/inconsistent data. Next.js
// (even in a single `next dev` process) instantiates route handlers and
// server components from separate module bundles, so a plain module-scoped
// singleton isn't actually shared between them. Stashing it on `globalThis`
// (the same trick used for the Prisma Client singleton in Next.js apps)
// keeps it to one real instance per process.
declare global {
  var __derisPglite: Promise<import("@electric-sql/pglite").PGlite> | undefined;
}

function getPGlite() {
  if (!globalThis.__derisPglite) {
    globalThis.__derisPglite = (async () => {
      const path = await import("node:path");
      const { PGlite } = await import("@electric-sql/pglite");
      return new PGlite(path.join(process.cwd(), ".pglite-data"));
    })();
  }
  return globalThis.__derisPglite;
}

/**
 * Run a parameterized SQL query against the database and return the rows.
 * Using a plain SQL layer (rather than an ORM) so we have full, predictable
 * control over the dynamically-built WHERE clauses used by search/filtering.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const connectionString = getConnectionString();
  if (connectionString) {
    const result = await pool(connectionString).query(text, params);
    return result.rows as T[];
  }

  const db = await getPGlite();
  const result = await db.query(text, params);
  return result.rows as T[];
}
