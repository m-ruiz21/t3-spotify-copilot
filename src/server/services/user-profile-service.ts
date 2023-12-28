import { getServerAuthSession } from "../auth/auth";
import { JWT } from "next-auth/jwt";
import SpotifyWebApi from "spotify-web-api-node";
import { openAi } from "../clients/openAi";
import userRepository from "../repository/user-repository";

type UserTop = {
    topArtists: string[],
    topGenres: string[],
    topTracks: {
        name: string,
        artists: string[]
    }[]
}
export async function createUserDescription(token: JWT, id: string) {
    const spotifyApi = await new SpotifyWebApi({ accessToken: token.accessToken });
    const userDesc = await getChatGPTDescription(spotifyApi);
    const user = await userRepository.update(id, { description: userDesc }); 
    
    return userDesc;
}

/**
 * Creates a description of the users music preferences using GPT-3 
 */
async function getChatGPTDescription(spotifyApi: SpotifyWebApi){
    const userTop = await getUserTop(spotifyApi); 
    const topDesc = await createUserTopDesc(userTop);
    const prompt = await createPrompt(topDesc);

    const chatResponse = await openAi.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a chatbot trained to generate prompts that describe a user's music preferences."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return chatResponse.choices[0]?.message?.content;
}


/**
 * Gets the users top artists, genres, and tracks
 * 
 * Uses the short term time range because it is more than likely that this will be the most accurate representation of the users current mood 
 */
async function getUserTop(spotifyApi: SpotifyWebApi){
    const { topArtists, topGenres } = await getTopArtistsAndGenres(spotifyApi);
    const topTracks = await getTopTracks(spotifyApi);

    return {
        topArtists: topArtists,
        topGenres: topGenres,
        topTracks: topTracks
    }
}


/**
 * Gets the users top artists and genres
 */
async function getTopArtistsAndGenres(spotifyApi: SpotifyWebApi){
    const topArtists = await spotifyApi.getMyTopArtists({time_range: "short_term", limit: 10});
    const artistNames = topArtists.body.items.map((artist) => artist.name);

    const genreCounts = topArtists.body.items.reduce((acc: any, artist: any) => {
            acc[artist.genre] = (acc[artist.genre] || 0) + 1
            return acc;
    }, {});

    const topGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);

    return {
        topArtists: artistNames,
        topGenres: topGenres
    }
}


/**
 * Gets the users top tracks
 */
async function getTopTracks(spotifyApi: SpotifyWebApi){
    const topTracks = await spotifyApi.getMyTopTracks({time_range: "short_term", limit: 10});
    return topTracks.body.items.map(
        (track) => ({ 
            name: track.name, 
            artists: track.artists.map((artist) => artist.name)
        })
    );
}

/**
 * Creates a description of the users top artists, genres, and tracks
 */
async function createUserTopDesc(userTop: UserTop){
    const topArtistSentence = `1. Favorite Artists: \n ${userTop.topArtists.map((artist) => `\t- ${artist}`).join("\n")}`;
    const topGenreSentence = `2. Favorite Genres: \n ${userTop.topGenres.map((genre) => `\t- ${genre}`).join("\n")}`;
    const topTrackSentence = `3. Favorite Tracks: \n ${userTop.topTracks.map((track) => `\t- ${track.name} by ${track.artists.join(", ")}`).join("\n")}`;

    return `${topArtistSentence} \n ${topGenreSentence} \n ${topTrackSentence}` 
}

async function createPrompt(topDesc: string){

    const prompt = `
    Generate a music preference description for the user:

    ${topDesc}

    4. Musical Properties:
    - Instrumentation: [Specify preferred instrumentation]
    - Tempo and Rhythm: [Specify preferred tempo and rhythm]
    - Vocal Style: [Specify preferred vocal style]
    - Lyric Themes: [Specify preferred lyric themes]

    5. Mood or Setting:
    - [Specify preferred mood or setting]

    6. Similar Artists/Genres to Explore:
    - [List of similar artists/genres to explore]

    7. Music to Avoid:
    - [List of genres, artists, or characteristics to avoid]

    8. Additional Notes:
    - [Any additional notes or preferences]
    `

    return prompt;
}