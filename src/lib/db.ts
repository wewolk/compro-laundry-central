import { Pool } from "pg";
import net from "net";

// Node 20+ enables Happy Eyeballs (autoSelectFamily) by default, which races
// IPv6 and IPv4 sockets. Against Neon's pooler that race never resolves and
// every connection dies with ETIMEDOUT even though plain psql connects fine.
// Disabling it restores the single-address behaviour pg expects.
if (typeof net.setDefaultAutoSelectFamily === "function") {
  net.setDefaultAutoSelectFamily(false);
}

// Neon (or any Postgres) connection pool, cached across hot reloads in dev so
// we don't exhaust connections.
const globalForPg = globalThis as unknown as { _pgPool?: Pool };

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL belum diset (cek .env.local)");
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  });
}

export function getPool(): Pool {
  if (!globalForPg._pgPool) {
    globalForPg._pgPool = createPool();
  }
  return globalForPg._pgPool;
}

export async function query<T extends Record<string, unknown>>(
  text: string,
  params?: unknown[]
) {
  return getPool().query<T>(text, params);
}

let schemaReady: Promise<void> | null = null;

/** Creates the content table once per process. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await query(`
        CREATE TABLE IF NOT EXISTS site_content (
          key         TEXT PRIMARY KEY,
          data        JSONB NOT NULL,
          updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
    })().catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}
