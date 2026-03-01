"use client";

import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createRoute } from "@/lib/createRoute";

export function DashboardAvatar() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="cursor-pointer rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Avatar className="size-8">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-primary text-white text-sm">
                            U
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <Link href={createRoute("/dashboard/profile")} className="flex items-center gap-2 cursor-pointer">
                        <UserCircle className="size-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">

                    <Link href={createRoute("/logout")} className="flex items-center gap-2 cursor-pointer">
                        <LogOut className="size-4" />
                        <span>Logout</span>
                    </Link>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
