import PlaylistBuilder from '@/components/Playlists/PlaylistBuilder';

export default function PlaylistBuilderPage() {
    return (
        <div className='flex min-h-screen flex-col px-24 pt-8'>
            <h1 className='mb-8 font-bold text-4xl'>Playlist Builder</h1>
            <PlaylistBuilder />
        </div>
    );
}
