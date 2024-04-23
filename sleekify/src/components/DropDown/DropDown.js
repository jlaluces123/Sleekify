'use client';
import { BreadcrumbEllipsis } from '../ui/breadcrumb';
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

const EllipsesMenu = () => {
    return (
        <DropdownMenu className='max-w-1/4'>
            <DropdownMenuTrigger>
                <BreadcrumbEllipsis className='h-6 w-6' />
                <span className='sr-only'>Toggle Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=''>
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EllipsesMenu;
