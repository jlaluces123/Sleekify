'use client';
import { getStaticProps, getServerSession } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import PlaylistList from '@/components/Playlists/PlaylistList';
import { redirect } from 'next/navigation';
import { NextAuthOptions } from 'next-auth';

export default function Home() {
    const { data: session, status } = useSession();

    return (
        <main className='flex min-h-screen flex-col items-center justify-center px-24 pt-8'>
            <div className='font-bold text-4xl'>
                {session ? <PlaylistList /> : redirect('/api/auth/signin')}
            </div>
        </main>
    );
}
