'use client';
import { useSession, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, redirect } from 'next/navigation';
import { Trash } from 'lucide-react';
import useDebounce from '@/lib/useDebounce';

async function parseSong(songName) {
    let song = songName;

    if (song.includes(' ')) {
        song.replace(' ', '+');
    }

    return song;
}

const PlaylistBuilder = () => {
    const { data: session, status } = useSession();
    const params = useParams();
    const [playlistSongs, setPlaylistSongs] = useState(null);
    const [hidden, setHidden] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedSongs, setSearchedSongs] = useState(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    let playlistIdMap = {};

    useEffect(() => {
        console.log('[PlaylistBuilder] session --> ', session);
        getPlaylistItems(session.user.accessToken, params.playlist_id)
            .then((songs) => {
                console.log('[getPlaylistItems] res --> ', songs);
                return setPlaylistSongs(songs);
            })
            .catch((err) => {
                console.log('[getPlaylistItems] ERR --> ', err);
                return err;
            });
    }, [session]);

    useEffect(() => {
        playlistSongs &&
            playlistSongs.map((song) => {
                if (!playlistIdMap[song.track.id]) {
                    playlistIdMap[song.track.id] = song;
                }
            });

        console.log('playlistIdMap --> ', playlistIdMap);
    }, [playlistSongs]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchSongs(session.user.accessToken, debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    const getPlaylistItems = async (accessToken, playlist_id) => {
        const playlists = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
            .then((res) => res.json())
            .catch((err) => console.error('[getPlaylistItems] err --> ', err));

        return playlists.items;
    };

    const searchSongs = async (accessToken, songName) => {
        // e.preventDefault();
        if (!songName || songName === '') return;
        const parsedSongName = await parseSong(songName);
        const songs = await fetch(
            `https://api.spotify.com/v1/search?q=${parsedSongName}&type=track`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
            .then((res) => res.json())
            .catch((err) => {
                console.error('[searchSongs] err --> ', err, {
                    songName,
                    accessToken,
                });
            });

        console.log('[searchSongs] songs --> ', songs);
        setSearchedSongs(songs.tracks.items);
        return songs.tracks.items;
    };

    const addSongToPlaylist = async (playlist_id, song) => {
        console.log(`adding '${song.name || song.album.name}' to playlist`);
        console.log(`checking ${song.id} in playlistIdMap --> `, playlistIdMap);

        if (playlistIdMap[song.id]) {
            console.log('song already exists in playlist');
            return;
        }

        const postSong = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uris: [song.uri] }),
            }
        )
            .then((res) => res.json())
            .catch((err) => console.error('[addSongToPlaylist] err --> ', err));

        console.log('[addSongToPlaylist] refetching playlist items');
        await getPlaylistItems(
            session.user.accessToken,
            params.playlist_id
        ).then((songs) => {
            console.log('[PlaylistBuilder] songs --> ', songs);
            setPlaylistSongs(songs);
        });
        return postSong;
    };

    const deleteSongFromPlaylist = async (playlist_id, song) => {
        console.log(
            `deleting ${song.track.name || song.track.album.name} from playlist`
        );
        const deleteSong = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tracks: [{ uri: song.track.uri }] }),
            }
        )
            .then((res) => res.json())
            .catch((err) =>
                console.error('[deleteSongFromPlaylist] err --> ', err)
            );

        await getPlaylistItems(
            session.user.accessToken,
            params.playlist_id
        ).then((songs) => {
            console.log('[PlaylistBuilder] songs --> ', songs);
            setPlaylistSongs(songs);
        });

        return deleteSong;
    };

    return (
        <div>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h3 className='font-bold text-2xl'>Your Playlist</h3>
                <button
                    className='uppercase text-gray-500 text-base'
                    onClick={() => setHidden(!hidden)}
                >
                    {hidden ? 'expand' : 'hide'}
                </button>
            </div>
            {hidden ? (
                <div></div>
            ) : !!playlistSongs && playlistSongs.length ? (
                <div>
                    {playlistSongs.map((song, index) => {
                        return (
                            <div className='' key={song.track.id}>
                                <div
                                    className={
                                        'song-name cursor-pointer w-full py-4 hover:bg-gray-300 justify-between items-center flex flex-row' +
                                        (index % 2 === 0 ? ' bg-gray-100' : '')
                                    }
                                >
                                    <p className='hover:underline text-2xl font-medium cursor-pointer truncate overflow-ellipsis max-w-3/4'>
                                        {song.track.name ||
                                            song.track.album.name}
                                    </p>
                                    <Trash
                                        className='h-10 w-10 p-2 rounded-full cursor-pointer hover:bg-gray-100'
                                        onClick={() =>
                                            deleteSongFromPlaylist(
                                                params.playlist_id,
                                                song
                                            )
                                        }
                                    ></Trash>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>No songs added yet!</div>
            )}
            <h3 className='mt-6 font-bold text-2xl'>Add New Songs</h3>
            <p className='text-gray-500 font-light'>
                Tap to add songs to your playlists!
            </p>
            {/* TODO: look into Layouts after */}
            <form
                onSubmit={(e) =>
                    searchSongs(e, session.user.accessToken, searchTerm)
                }
                className='flex flex-row justify-between my-2'
            >
                <input
                    type='text'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className='w-full p-4 border border-gray-300 rounded-lg'
                    placeholder='Search for songs to add...'
                />
            </form>
            {!!searchedSongs && searchedSongs.length ? (
                <div className='song-list'>
                    {searchedSongs.map((song) => {
                        return (
                            <div
                                className='flex flex-row justify-between my-2 items-center'
                                key={song.id}
                            >
                                <div
                                    className='py-4 pl-2 flex items-center cursor-pointer hover:bg-green-200 w-full'
                                    onClick={() =>
                                        addSongToPlaylist(
                                            params.playlist_id,
                                            song
                                        )
                                    }
                                >
                                    {song.album.images ? (
                                        <img
                                            className='w-14 h-14 rounded-sm mr-2'
                                            src={
                                                song.album.images[
                                                    song.album.images.length - 1
                                                ].url
                                            }
                                        />
                                    ) : (
                                        ''
                                    )}
                                    <p className='hover:underline text-xl font-medium cursor-pointer truncate overflow-ellipsis max-w-3/4'>
                                        {song.name || song.album.name}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div />
            )}
        </div>
    );
};

export default PlaylistBuilder;
