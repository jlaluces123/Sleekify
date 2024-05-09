'use client';
import { useSession, getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreatePlaylist from './CreatePlaylist';
import DeleteModal from '../Modals/DeleteModal';

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
                return filterPlaylists.items.filter(
                    (playlist) =>
                        playlist.owner.display_name === session.user.name
                );
            });
        setMyPlaylists(playlists);
        return playlists;
    };

    useEffect(() => {
        console.log('[myPlaylists useEffect] UPDATED --> ', myPlaylists);
    }, [myPlaylists]);

    useEffect(() => {
        getMyPlaylists(session.user.accessToken)
            .then((playlists) => {
                // console.log('[getMyPlaylists] res --> ', playlists);
            })
            .catch((err) => {
                console.error('[getMyPlaylists] err --> ', err);
                return err;
            });
    }, [session]);

    return (
        <div className='w-full'>
            <h1 className='text-4xl font-bold mb-8'>Playlist Builder</h1>
            <CreatePlaylist refetch={getMyPlaylists} />
            {!!myPlaylists && myPlaylists.length ? (
                <div className='max-w-full'>
                    <div className='bg-gray-100 py-2 cursor-pointer hover:bg-gray-300'>
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
                                    'flex justify-between items-center flex-row py-2 cursor-pointer hover:bg-gray-300' +
                                    ((index + 1) % 2 === 0
                                        ? ' bg-gray-100'
                                        : '')
                                }
                                onClick={() =>
                                    router.push(
                                        `/playlist-builder/${playlist.id}`
                                    )
                                }
                                key={playlist.id}
                            >
                                <a
                                    className='hover:underline text-2xl font-semibold cursor-pointer truncate overflow-ellipsis max-w-3/4'
                                    onClick={() =>
                                        router.push(
                                            `/playlist-builder/${playlist.id}`
                                        )
                                    }
                                >
                                    {playlist.name}
                                </a>
                                <DeleteModal
                                    playlistDetails={playlist}
                                    playlistId={playlist.id}
                                    refetch={getMyPlaylists}
                                />
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
