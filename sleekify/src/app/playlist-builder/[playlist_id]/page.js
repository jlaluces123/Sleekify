'use client';
import PlaylistBuilder from '@/components/Playlists/PlaylistBuilder';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PlaylistBuilderPage() {
    const { data: session, status } = useSession();

    return (
        <div className='flex min-h-screen flex-col px-24 max-sm:px-6 pt-8'>
            {session ? (
                <div className=''>
                    <h1 className='mb-8 font-bold text-4xl'>
                        Playlist Builder
                    </h1>
                    <PlaylistBuilder />
                </div>
            ) : (
                redirect('/api/auth/signin')
            )}
        </div>
    );
}
