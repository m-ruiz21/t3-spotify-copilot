import { Session } from "@prisma/client";
import { db } from "@/server/clients/db";
import { Ok, Err } from "@/common/models/result";

/**
 * Utility function to retrieve the access token for a given session.
 *  
 * @param session   Current user session 
 * @returns         Result with JWT access token or ErrorWithCode
 */
export async function get_token(session: Session) {
    const account = await db.account.findUnique({
        where: {
            id: session.id,
        },
    });

    if (!account) {
        return Err({
            code: 403,
            message: "Authenticated Account not found",
        });
    }

    return Ok(account.access_token);
}