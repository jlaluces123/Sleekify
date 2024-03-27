import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

async function refreshAccessToken(refreshToken) {
    const url =
        'https://accounts.spotify.com/api/token' +
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_ID,
        });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const newToken = await response.json();

    console.log('refreshAccessToken --> ', newToken);

    localStorage.setItem('access_token', newToken.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
}

const authOptions = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            authorization: {
                params: {
                    scope: 'user-read-email user-read-private user-read-currently-playing user-read-playback-position user-top-read user-read-recently-played playlist-read-private playlist-modify-public playlist-modify-private',
                },
            },
            checks: ['none'],
        }),
    ],
    callbacks: {
        // Copy pasted from: https://github.com/ankitk26/Next-spotify/blob/main/pages/api/auth/%5B...nextauth%5D.ts
        // No idea why this works compared to what I've been trying to do?
        async jwt({ token, account }) {
            if (account) {
                token.id = account.id;
                token.expires_at = account.expires_at;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                return token;
            }

            if (Date.now() < token.expires_at * 1000) {
                return token;
            }

            return refreshAccessToken(token.refreshToken);
        },
        async session({ session, token }) {
            session.user = token;
            console.log('[callbacks] session --> ', session, token);
            return session;
        },
    },
});

export { authOptions as GET, authOptions as POST, authOptions as authOptions };
