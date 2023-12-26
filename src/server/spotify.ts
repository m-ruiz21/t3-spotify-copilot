import SpotifyWebApi from 'spotify-web-api-node';
import { env } from '@/env';

const globalForSpotify = globalThis as unknown as {
    spotify: SpotifyWebApi | undefined;
};

export const spotifyApi =
    globalForSpotify.spotify ??
    new SpotifyWebApi({
        clientId: env.SPOTIFY_CLIENT_ID,
        clientSecret: env.SPOTIFY_CLIENT_SECRET,
        redirectUri: env.NEXTAUTH_URL,
    });

if (env.NODE_ENV !== "production") globalForSpotify.spotify = spotifyApi;