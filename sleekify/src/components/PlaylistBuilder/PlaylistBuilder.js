'use client';
import { useSession, getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

async function getMyPlaylists(accessToken) {
    const playlists = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((res) => res.json());

    return playlists.items;
}

const PlaylistBuilder = () => {
    const { data: session, status } = useSession();
    const [myPlaylists, setMyPlaylists] = useState(null);

    useEffect(() => {
        if (!!session.user.accessToken) {
            getMyPlaylists(session.user.accessToken).then((playlists) => {
                console.log('[PlaylistBuilder] playlists --> ', playlists);
                setMyPlaylists(playlists);
            });
        }
    }, [session.user.accessToken]);

    return (
        <div>
            <h1 className='mb-8'>Playlist Builder</h1>
            {!!myPlaylists && myPlaylists.length ? (
                <div>
                    {myPlaylists.map((playlist) => {
                        return (
                            <div className='d-flex flex-row' key={playlist.id}>
                                <h1 className='hover:underline hover:cursor-pointer'>
                                    {playlist.name}
                                </h1>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>loading...</div>
            )}
        </div>
    );
};

export default PlaylistBuilder;
