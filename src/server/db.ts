import { PrismaClient } from "@prisma/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/env";

// Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Supabase Client
const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient | undefined;
};

export const supabase =
  globalForSupabase.supabase ??
  createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

if (env.NODE_ENV !== "production") globalForSupabase.supabase = supabase;