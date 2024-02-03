'use client';
import { useSession, getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function getMyPlaylists(accessToken) {
    const playlists = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((res) => res.json());

    return playlists.items;
}

const PlaylistList = () => {
    const { data: session, status } = useSession();
    const [myPlaylists, setMyPlaylists] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!!session.user.accessToken) {
            getMyPlaylists(session.user.accessToken).then((playlists) => {
                console.log('[PlaylistList] playlists --> ', playlists);
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
                                <a
                                    className='hover:underline hover:cursor-pointer'
                                    onClick={() =>
                                        router.push(
                                            `/playlist-builder/${playlist.id}`
                                        )
                                    }
                                >
                                    {playlist.name}
                                </a>
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

export default PlaylistList;