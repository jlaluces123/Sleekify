'use client';
import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({ children }) {
    return (
        <SessionProvider refetchInterval={60 * 60}>{children}</SessionProvider>
    );
}
