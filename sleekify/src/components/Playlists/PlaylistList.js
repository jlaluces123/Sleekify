'use client';
import { useSession, getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreatePlaylist from './CreatePlaylist';

const PlaylistList = () => {
    const { data: session, status } = useSession();
    const [myPlaylists, setMyPlaylists] = useState(null);
    const router = useRouter();

    const getMyPlaylists = async (accessToken) => {
        const playlists = await fetch(
            'https://api.spotify.com/v1/me/playlists?limit=50',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
            .then((res) => res.json())
            .then((filterPlaylists) => {
                console.log(filterPlaylists);
                return filterPlaylists.items.filter(
                    (playlist) =>
                        playlist.owner.display_name === session.user.name
                );
            });

        return playlists;
    };

    useEffect(() => {
        getMyPlaylists(session.user.accessToken)
            .then((playlists) => {
                console.log('[getMyPlaylists] res --> ', playlists);
                return setMyPlaylists(playlists);
            })
            .catch((err) => {
                console.error('[getMyPlaylists] err --> ', err);
                return err;
            });
    }, [session]);

    return (
        <div>
            <h1 className='mb-8'>Playlist Builder</h1>
            <CreatePlaylist />
            {!!myPlaylists && myPlaylists.length ? (
                <div>
                    <a
                        className='hover:underline hover:cursor-pointer'
                        onClick={() =>
                            router.push(`/playlist-builder/liked-songs`)
                        }
                    >
                        Liked Songs
                    </a>
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
