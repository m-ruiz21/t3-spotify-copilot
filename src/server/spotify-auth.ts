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