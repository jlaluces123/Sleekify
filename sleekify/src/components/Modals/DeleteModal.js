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
                <button className='text-red-500 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none'>
                    Delete
                </button>
            </DialogTrigger>
            <DialogContent>
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
                    <div className='flex justify-between items-center'>
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
                                I understand, remove this playlist
                            </button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
