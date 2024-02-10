import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';
import SessionProvider from '@/components/Provider/SessionProvider';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Sleekify',
    description: 'Spotify, but sleeker.',
};

export default async function RootLayout({ children }) {
    const session = await getServerSession();
    console.log('[layout.js] session --> ', session);

    if (session) {
        return (
            <html lang='en'>
                <body className=''>
                    <SessionProvider
                        session={session}
                        refetchInterval={60 * 60}
                    >
                        <Navigation />
                        {children}
                    </SessionProvider>
                </body>
            </html>
        );
    } else {
        redirect('/api/auth/signin');
    }
}
