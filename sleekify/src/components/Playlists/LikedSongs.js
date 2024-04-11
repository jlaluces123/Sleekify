'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import moment from 'moment';

const LikedSongs = () => {
    const { data: session, status } = useSession();
    const [likedSongs, setLikedSongs] = useState(null);

    const getLikedSongs = async (accessToken) => {
        const songs = await fetch(
            'https://api.spotify.com/v1/me/tracks?limit=50&offset=0',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
            .then((res) => res.json())
            .catch((err) => console.error('[getLikedSongs] err --> ', err));

        return songs;
    };

    const getSongGenre = async (artistId, accessToken) => {
        const genre = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
            .then((res) => res.json())
            .catch((err) => console.error('[getSongGenre] err --> ', err));

        return genre;
    };

    const getGenreSeeds = async (accessToken) => {
        const genreSeeds = await fetch(
            'https://api.spotify.com/v1/recommendations/available-genre-seeds',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
            .then((res) => res.json())
            .catch((err) => console.error('[getGenreSeeds] err --> ', err));

        return genreSeeds;
    };

    useEffect(() => {
        console.log('[LikedSongs] session --> ', session);
        getLikedSongs(session.user.accessToken)
            .then((likedSongs) => {
                console.log('[getLikedSongs] res --> ', likedSongs);
                return setLikedSongs(likedSongs);
            })
            .catch((err) => {
                console.error('[getLikedSongs] err --> ', err);
                return err;
            });
        getGenreSeeds(session.user.accessToken)
            .then((res) => {
                console.log('[getGenreSeeds] res --> ', res);
                return res;
            })
            .catch((err) => {
                console.error('[getGenreSeeds] err --> ', err);
                return err;
            });
    }, [session]);

    return (
        <div>
            <div className='filters'></div>
            {!!likedSongs && likedSongs.items.length ? (
                <table id='likedSongs'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Genre</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {likedSongs.items.map((song, index) => {
                            return (
                                <tr key={song.track.id}>
                                    <td>{index + 1}</td>
                                    <td>{song.track.name}</td>
                                    <td>{song.track.artists[0].name}</td>
                                    <td>{moment(song.added_at).fromNow()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default LikedSongs;
