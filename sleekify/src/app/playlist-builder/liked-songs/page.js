'use client';
import LikedSongs from '@/components/Playlists/LikedSongs';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

const LikedSongsPage = () => {
    const { data: session, status } = useSession();
    return (
        <div>
            {session ? (
                <div>
                    <h1 className='mb-8'>Liked Songs</h1>
                    <LikedSongs />
                </div>
            ) : (
                redirect('/api/auth/signin')
            )}
        </div>
    );
};

export default LikedSongsPage;
