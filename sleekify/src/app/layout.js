import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';
import SessionProvider from '@/components/Provider/SessionProvider';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Sleekify',
    description: 'Spotify, but sleeker.',
};

export default async function RootLayout({ children }) {
    const session = await getServerSession();

    return (
        <html lang='en'>
            <body className=''>
                <SessionProvider session={session}>
                    <Navigation />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
