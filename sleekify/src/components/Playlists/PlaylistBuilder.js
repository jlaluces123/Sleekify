'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, redirect } from 'next/navigation';

async function getPlaylistItems(accessToken, playlist_id) {
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
}

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

    const handleSearch = (songName) => {
        console.log('[handleSearch] songName --> ', songName);
        setSearchTerm(songName);
    };

    const searchSongs = async (e, accessToken, songName) => {
        e.preventDefault();
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
            .catch((err) => console.error('[searchSongs] err --> ', err));

        console.log('[searchSongs] songs --> ', songs);
        setSearchedSongs(songs.tracks.items);
        return songs.tracks.items;
    };

    const addSongToPlaylist = async (playlist_id, song) => {
        console.log(`adding '${song.name || song.album.name}' to playlist`);
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
            <div className='flex flex-row justify-between'>
                <h3 className='mb-2 font-bold text-2xl'>Your Playlist</h3>
                <button onClick={() => setHidden(!hidden)}>
                    {hidden ? 'expand' : 'hide'}
                </button>
            </div>
            {hidden ? (
                <div></div>
            ) : !!playlistSongs && playlistSongs.length ? (
                <div>
                    {!!playlistSongs &&
                        playlistSongs.map((song) => {
                            return (
                                <div
                                    className='flex flex-row justify-between my-4'
                                    key={song.track.id}
                                >
                                    <div className='song-name cursor-pointer w-full my-2 hover:bg-gray-200'>
                                        {song.track.name ||
                                            song.track.album.name}{' '}
                                        by{' '}
                                        {song.track.artists.map((artist) => {
                                            return artist.name + ', ';
                                        })}
                                    </div>
                                    <div className='right-song'>
                                        <button
                                            onClick={() =>
                                                deleteSongFromPlaylist(
                                                    params.playlist_id,
                                                    song
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            ) : (
                <div>loading...</div>
            )}
            <h3 className='mt-6 mb-4 font-bold text-2xl'>Add New Songs</h3>
            {/* TODO: look into Layouts after */}
            <form
                onSubmit={(e) =>
                    searchSongs(e, session.user.accessToken, searchTerm)
                }
                className='flex flex-row justify-between my-2'
            >
                <input
                    type='text'
                    onChange={(e) => handleSearch(e.target.value)}
                    className='w-full'
                    placeholder='Search for songs to add...'
                />
                <input type='submit' />
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
                                            className='w-10 h-10'
                                            src={
                                                song.album.images[
                                                    song.album.images.length - 1
                                                ].url
                                            }
                                        />
                                    ) : (
                                        ''
                                    )}
                                    {song.name || song.album.name} by{' '}
                                    {song.artists.map((artist) => {
                                        return artist.name + ', ';
                                    })}
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
