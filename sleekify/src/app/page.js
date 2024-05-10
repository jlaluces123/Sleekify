'use client';
import { getStaticProps, getServerSession } from 'next-auth';
import { getSession, signIn, useSession } from 'next-auth/react';
import PlaylistList from '@/components/Playlists/PlaylistList';
import { redirect } from 'next/navigation';
import { NextAuthOptions } from 'next-auth';

export default function Home() {
    const { data: session } = useSession();

    if (session) {
        console.log('[root page.js] session --> ', session);
        return (
            <main className='flex max-w-max min-w-full min-h-screen flex-col items-center justify-center px-24 max-sm:px-4 pt-8'>
                <PlaylistList />
            </main>
        );
    }

    return (
        <div className='flex flex-col justify-center items-center h-screen bg-cover bg-center p-4'>
            <h1 className='text-4xl font-bold mb-4 text-center'>Sleekify</h1>
            <p className='text-xl mb-6 text-center max-w-md'>
                Create, edit, and manage playlists easier than ever before.
                Experience playlist management as it should be — sleek and
                simple.
            </p>
            <button
                onClick={() => signIn('spotify')}
                className='cta-btn text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-md'
            >
                Sign In
            </button>
        </div>
    );
}
