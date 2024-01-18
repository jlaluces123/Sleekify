import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Sleekify',
    description: 'Spotify, but sleeker.',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className=''>
                <Navigation />
                {children}
            </body>
        </html>
    );
}
