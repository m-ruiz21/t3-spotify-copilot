import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

import * as trpc from '@trpc/server';

import UserRepository from "@/server/repository/user-repository";
import { match } from "@/common/models/result";
import { createUserDescription } from "@/server/services/user-profile-service";
import { Ok } from "@/common/models/result";

const FOUR_WEEKS_IN_MS = 4 * 7 * 24 * 60 * 60 * 1000;
export const userProfileRouter = createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        console.log("[API] GET /api/user-profile");
        const token = ctx.session.user.token; 
        const user = await UserRepository.findById(ctx.session.user.id);
        return match(user)(
            async (user) => {
                if (
                    !user.description ||
                    !user.lastUpdated ||
                    new Date().getTime() - user.lastUpdated.getTime() > FOUR_WEEKS_IN_MS 
                ) {
                    console.log("[API] GET /api/user-profile - Creating new user description");
                    return await createUserDescription(token, user.id);
                }
                
                return Ok(user.description);     
            },
            (error) => {
                throw new trpc.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
            }
        )
    }),
});
