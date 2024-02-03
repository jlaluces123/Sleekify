'use client';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Navigation = () => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <div className='parent flex justify-between items-center w-full px-8 mt-8'>
            <div className='left'>
                <div className='logo'>
                    <h1
                        className='font-bold text-4xl hover:cursor-pointer'
                        onClick={() => router.push('/')}
                    >
                        Sleekify
                    </h1>
                </div>
                <div className='sandwich'></div>
            </div>
            <div className='right'>
                {session ? (
                    <div className='flex flex-row'>
                        <button className='cta-btn mr-6'>+ New Playlist</button>
                        <button
                            className='cta-btn mr-6'
                            onClick={() => signOut()}
                        >
                            Sign Out
                        </button>
                        <button className='h-10 w-10'>
                            <img
                                className='rounded-full'
                                src={session?.user?.picture}
                                alt='Profile Picture'
                            />
                        </button>
                    </div>
                ) : (
                    <button className='cta-btn mr-4' onClick={() => signIn()}>
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navigation;
