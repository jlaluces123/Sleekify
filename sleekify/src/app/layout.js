import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';
import NextAuthProvider from '@/components/Provider/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Sleekify',
    description: 'Spotify, but sleeker.',
};

export default async function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className=''>
                <NextAuthProvider>
                    <Navigation />
                    {children}
                </NextAuthProvider>
            </body>
        </html>
    );
}
