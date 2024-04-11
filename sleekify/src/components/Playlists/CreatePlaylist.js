'use client';
import { useSession, getSession } from 'next-auth/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const CreatePlaylist = () => {
    const { data: session } = useSession();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='mb-8 bg-green-500 hover:cursor-pointer'>
                    <h1>Create Playlist</h1>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Create a Playlist</DialogHeader>
                <DialogDescription>
                    Create a playlist here Lorem, ipsum dolor sit amet
                    consectetur adipisicing elit. Assumenda, animi.
                </DialogDescription>
                <div className='dialog-body flex flex-col'>
                    <label htmlFor='playlist-name'>Playlist Name</label>
                    <input type='text' name='name' id='playlist-name' />
                    <label htmlFor='playlist-description'>
                        Playlist Description
                    </label>
                    <textarea name='description' id='playlist-description' />
                    <div className='playlist-switches flex flex-row justify-between my-4'>
                        <div className='flex align-center'>
                            <label className='pr-2' htmlFor='public'>
                                Public
                            </label>
                            <Switch id='public' />
                        </div>
                        <div className='flex align-center'>
                            <label className='pr-2' htmlFor='collaborative'>
                                Collaborative
                            </label>
                            <Switch id='collaborative' />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <button type='submit'>Create</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePlaylist;
