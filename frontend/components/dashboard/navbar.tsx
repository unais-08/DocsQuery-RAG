"use client";

import { Bell, Search } from "lucide-react";
import { UserMenu } from "./user-menu";

export function Navbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">

            {/* Search */}
            <div className="relative hidden w-full max-w-md sm:block">
                <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="search"
                    placeholder="Search documents..."
                    className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                />
            </div>

            {/* Right */}
            <div className="ml-auto flex items-center gap-3">

                <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                    <Bell size={19} />

                    <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-brand-600" />
                </button>

                <UserMenu />

            </div>

        </header>
    );
}