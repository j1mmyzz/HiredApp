"use client";

import Link from "next/link";
import { UserNav } from "./auth/UserNav";
import { usePathname } from "next/navigation";
import { Brain } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary text-white" />
          <span className="font-bold text-lg">Hired</span>
        </Link>
        <UserNav />
      </div>
    </header>
  );
}
