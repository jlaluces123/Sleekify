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

import { Trash } from 'lucide-react';

const DeleteModal = ({ playlistId, refetch }) => {
    const { data: session } = useSession();

    const deletePlaylist = async () => {
        console.log('deletePlaylist --> ', playlistId);
        await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((playlist) => refetch(session.user.accessToken))
            .catch((err) => console.error('[deletePlaylist] err --> ', err));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Trash className='h-10 w-10 p-2 rounded-full cursor-pointer hover:bg-gray-100' />
            </DialogTrigger>
            <DialogContent className='w-11/12'>
                <DialogHeader>
                    <DialogTitle className='text-red-400'>
                        Are you sure?
                    </DialogTitle>
                </DialogHeader>
                <p className='text-pretty text-sm text-gray-500'>
                    This action will{' '}
                    <span className='font-bold uppercase text-gray-600'>
                        permanently
                    </span>{' '}
                    remove this playlist from your account. This cannot be
                    undone.
                </p>
                <hr />
                <DialogFooter>
                    <div className='w-full flex justify-between items-center'>
                        <DialogClose asChild>
                            <button className='text-gray-700 text-sm border-black border rounded py-2 px-4'>
                                Cancel
                            </button>
                        </DialogClose>
                        <DialogClose asChild>
                            <button
                                className='text-red-50 text-sm bg-red-500 rounded py-2 px-4'
                                onClick={deletePlaylist}
                            >
                                Delete Playlist
                            </button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
