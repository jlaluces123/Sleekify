'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

async function getPlaylistItems(accessToken, playlist_id) {
    const songs = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    ).then((res) => res.json());

    return songs.items;
}

const PlaylistBuilder = () => {
    const { data: session, status } = useSession();
    const params = useParams();
    const [playlistSongs, setPlaylistSongs] = useState(null);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (!!session.user.accessToken) {
            console.log(
                '[PlaylistBuilder] accessToken --> ',
                session.user.accessToken
            );
            console.log('[PlaylistBuilder] params --> ', params);
            getPlaylistItems(session.user.accessToken, params.playlist_id).then(
                (songs) => {
                    console.log('[PlaylistBuilder] songs --> ', songs);
                    setPlaylistSongs(songs);
                }
            );
        }
    }, [status, session.user.accessToken]);

    return (
        <div>
            <div className='flex flex-row'>
                <h3 className='mb-2 font-bold text-2xl'>Your Playlist</h3>
                <button onClick={() => setHidden(!hidden)}>
                    {hidden ? 'expand' : 'hide'}
                </button>
            </div>
            {hidden ? (
                <div>...</div>
            ) : !!playlistSongs && playlistSongs.length ? (
                <div>
                    {!!playlistSongs &&
                        playlistSongs.map((song) => {
                            return (
                                <div
                                    className='flex flex-row'
                                    key={song.track.id}
                                >
                                    {song.track.name || song.track.album.name}{' '}
                                    by{' '}
                                    {song.track.artists.map((artist) => {
                                        return artist.name + ', ';
                                    })}
                                </div>
                            );
                        })}
                </div>
            ) : (
                <div>loading...</div>
            )}
            <h3 className='my-2 font-bold text-2xl'>Add New Songs</h3>
        </div>
    );
};

export default PlaylistBuilder;
