import { JWT } from "next-auth/jwt";
import { SpotifyToken } from "@/common/models/spotify";

/**
 * Refresh Spotify JWT token 
 *  
 * @param token current JWT token
 * @returns JWT token with updated access/refresh token and expiration date
 */
export async function refreshAccessToken(token: JWT) : Promise<JWT> {
    const request = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
        },
        body: `grant_type=refresh_token&refresh_token=${token.refreshToken}`,
        cache: "no-cache"
    });

    if (request.ok) {
        const spotify_token: SpotifyToken = await request.json();

        return {
            ...token,
            accessToken: spotify_token.access_token,
            refreshToken: spotify_token.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + spotify_token.expires_in
        };
    }

    return {
        ...token,
        error:`[ ERROR ] failed to refresh token with code ${request.status}: ${request.statusText}`
    }
}

/* 
We define the spotify specific scopes we want to request from the user 
See: https://developer.spotify.com/documentation/general/guides/scopes/
*/
const scopes = [
    "user-read-email",
    "user-top-read",
    "user-read-recently-played",
    "user-modify-playback-state",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
].join(",");

const params = {
    scope: scopes,
};

const queryParamString = new URLSearchParams(params).toString();

const AUTH_URL = `https://accounts.spotify.com/authorize?` + queryParamString.toString();

export { AUTH_URL };