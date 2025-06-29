"use client";

import Link from "next/link";
import { UserNav } from "./auth/UserNav";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";

export function Header() {
    const pathname = usePathname();

    if (pathname === '/login') {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                         <Compass className="h-6 w-6 text-primary" />
                         <span className="font-bold text-lg">Hired</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
