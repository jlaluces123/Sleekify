'use client';
import Link from 'next/link';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Navigation = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session.expires) {
            console.log('[Navigation] no session.expires --> ', session);
            getSession().then((session) => {
                console.log('[Navigation] getSession() res --> ', session);
            });
        } else {
            console.log('[Navigation] session.expires --> ', session);
        }
    }, [session]);

    return (
        <div className='navigation flex justify-between items-center w-full px-8 max-sm:px-4 mt-8 max-sm:mt-4'>
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
