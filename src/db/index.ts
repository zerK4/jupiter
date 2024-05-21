import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

export const client = createClient({
  url: process.env.LOCAL_DB as string,
  syncUrl: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_DB_TOKEN!,
  encryptionKey: process.env.ENCRYPTION_KEY,
});

export const db = drizzle(client, { schema });
