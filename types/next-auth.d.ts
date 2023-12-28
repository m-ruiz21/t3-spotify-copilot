/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      token: JWT;
    } & DefaultSession["user"];
  }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string ;
        expires_at: number;
        refreshToken: string;
        error: string?
    }
}
