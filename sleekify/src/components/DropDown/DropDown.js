'use client';
import { BreadcrumbEllipsis } from '../ui/breadcrumb';
import React, { useState, useEffect } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import DeleteModal from '@/components/Modals/DeleteModal';

const EllipsesMenu = ({ playlistId, refetch }) => {
    return (
        <DropdownMenu className='max-w-1/4'>
            <DropdownMenuTrigger>
                <BreadcrumbEllipsis className='h-6 w-6' />
                <span className='sr-only'>Toggle Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteModal playlistId={playlistId} refetch={refetch} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EllipsesMenu;
