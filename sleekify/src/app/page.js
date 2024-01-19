import { getServerSession } from 'next-auth';

export default async function Home() {
    const session = await getServerSession();

    // if (session) console.log('Home --> ', session);

    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24'>
            <div className='font-bold text-4xl'>
                {session ? 'You are signed in' : 'You are not signed in'}
            </div>
        </main>
    );
}
