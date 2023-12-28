import { createTRPCRouter } from "@/server/api/trpc";
import { userProfileRouter } from "./routers/user-profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  userProfile: userProfileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
