import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (embedded Postgres used for local dev when no DATABASE_URL is
  // set) loads a WASM binary via filesystem paths that break when bundled
  // by Turbopack/webpack — keep it as a native Node require instead.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
