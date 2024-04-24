'use client';
import { useSession, getSession } from 'next-auth/react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const CreatePlaylist = ({ refetch }) => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        public: false,
        collaborative: false,
    });
    const [dialogueOpen, setDialogueOpen] = useState(false);

    const createPlaylist = async (formData) => {
        console.log('[createPlaylist] formData --> ', formData);
        await fetch(
            `https://api.spotify.com/v1/users/${session.user.name}/playlists`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }
        )
            .then((res) => res.json())
            .then((playlist) => refetch(session.user.accessToken))
            .catch((err) => console.error('[createPlaylist] err --> ', err));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        console.log(`Changing ${name}: ${newValue}`);

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        console.log('submitting form data --> ', formData);
        createPlaylist(formData);
        setDialogueOpen(false);
        e.preventDefault();
    };

    const handleDialogueChange = () => {
        console.log('handleDialogueChange --> ', !dialogueOpen);
        setDialogueOpen(!dialogueOpen);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Dialog onOpenChange={handleDialogueChange} open={dialogueOpen}>
                <DialogTrigger asChild>
                    <button className='mb-8 p-4 w-full font-bold text-2xl bg-green-400 hover:cursor-pointer hover:bg-green-500'>
                        <h1>Create Playlist</h1>
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>Create a Playlist</DialogHeader>
                    <DialogDescription>
                        Ready to groove? Quickly craft your perfect playlist
                        here!
                    </DialogDescription>
                    <hr className='' />
                    <div className='dialog-body flex flex-col'>
                        <div className='name'>
                            <label htmlFor='playlist-name'>Playlist Name</label>
                            <Input
                                type='text'
                                id='playlist-name'
                                placeholder='Indie Rock Road Trip! Give your mix a title...'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='description mt-4'>
                            <label htmlFor='playlist-description'>
                                Playlist Description
                            </label>
                            <Textarea
                                placeholder={`Summer vibes? Workout hits? Describe your playlist's theme...`}
                                id='playlist-description'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='playlist-switches flex flex-row justify-between my-4'>
                            <div className='flex align-center'>
                                <label className='pr-2' htmlFor='public'>
                                    Public
                                </label>
                                <Switch
                                    id='public'
                                    name='public'
                                    checked={formData.public}
                                    onCheckedChange={(e) => {
                                        console.log(
                                            'public onChange --> ',
                                            !formData.public
                                        );
                                        setFormData({
                                            ...formData,
                                            public: !formData.public,
                                        });
                                    }}
                                />
                            </div>
                            <div className='flex align-center'>
                                <label className='pr-2' htmlFor='collaborative'>
                                    Collaborative
                                </label>
                                <Switch
                                    id='collaborative'
                                    name='collaborative'
                                    checked={formData.collaborative}
                                    onCheckedChange={(e) => {
                                        console.log(
                                            'collaborative onChange --> ',
                                            !formData.collaborative
                                        );
                                        setFormData({
                                            ...formData,
                                            collaborative:
                                                !formData.collaborative,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <hr className='my-2' />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                type='submit'
                                onClick={handleSubmit}
                                className='border py-1 px-4 rounded bg-green-400 hover:bg-green-500 font-medium hover:font-semibold hover:underline'
                            >
                                🎵 Create
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    );
};

export default CreatePlaylist;
