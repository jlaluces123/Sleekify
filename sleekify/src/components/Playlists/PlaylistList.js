'use client';
import { useSession, getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreatePlaylist from './CreatePlaylist';

import EllipsesMenu from '@/components/DropDown/DropDown';

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
        <div className='w-full'>
            <h1 className='text-4xl font-bold mb-8'>Playlist Builder</h1>
            <CreatePlaylist />
            {!!myPlaylists && myPlaylists.length ? (
                <div className='max-w-full'>
                    <div className='bg-gray-100 py-2'>
                        <a
                            className='text-2xl font-semibold hover:underline hover:cursor-pointer'
                            onClick={() =>
                                router.push(`/playlist-builder/liked-songs`)
                            }
                        >
                            Liked Songs
                        </a>
                    </div>
                    {myPlaylists.map((playlist, index) => {
                        return (
                            <div
                                className={
                                    'flex justify-between items-center flex-row py-2' +
                                    ((index + 1) % 2 === 0
                                        ? ' bg-gray-100'
                                        : '')
                                }
                                key={playlist.id}
                            >
                                <a
                                    className='hover:underline text-2xl font-semibold hover:cursor-pointer truncate overflow-ellipsis max-w-3/4'
                                    onClick={() =>
                                        router.push(
                                            `/playlist-builder/${playlist.id}`
                                        )
                                    }
                                >
                                    {playlist.name}
                                </a>
                                <EllipsesMenu />
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
