/**
 * Initialize singleton instance of Prisma Client if not in production.
 */

import { PrismaClient } from "@prisma/client";

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