import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { AUTH_URL, refreshAccessToken } from "@/server/auth/utils/spotify-auth-utils";

import UserRepository from "../repository/user-repository";

import { env } from "@/env";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  callbacks: {
    jwt: async ({ token, account, user, trigger }) => {
      if (trigger == "signUp") {
        UserRepository.create({
          id: user.id,
        })
      }

      if (! account) {
        return token;
      }
      
      const today = Math.floor(Date.now() / 1000); // Date.now() in ms, account.expires_at in min
      if (today < account.expires_at!) {
        return {
          ...token,
          accessToken: account.access_token as string,
          refreshToken: account.refresh_token as string,
          expires_at: account.expires_at!
        };
      }

      return await refreshAccessToken(token);
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        token: token,
      },
    }),
  },
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: AUTH_URL
    }),
  ],
  theme: {
    colorScheme: "auto",              // "auto" | "dark" | "light"
    brandColor: "#1DB954",            // spotify green 
    logo: "/copilot-logo.png",        
    buttonText: "#fffff"              // white 
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
