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
            <main className='flex min-h-screen flex-col items-center justify-center px-24 max-sm:px-4 pt-8'>
                <div className='font-bold text-4xl'>
                    <PlaylistList />
                </div>
            </main>
        );
    }

    return (
        <>
            <h1>Not Signed In</h1>
            <button onClick={() => signIn()}>Sign In</button>
        </>
    );
}
