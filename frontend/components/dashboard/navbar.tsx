"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";

import { UserMenu } from "./user-menu";
import { MobileSidebar } from "./mobile-sidebar";

export function Navbar() {
    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    return (
        <>
            {/* Mobile Sidebar */}
            <MobileSidebar
                open={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">

                {/* Left */}
                <div className="flex items-center gap-3">

                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(true)}
                        aria-label="Open navigation"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
                    >
                        <Menu size={21} />
                    </button>

                    {/* Mobile title */}
                    <div className="text-sm font-semibold text-gray-900 lg:hidden">
                        DocsQuery
                    </div>

                    {/* Desktop search */}
                    <div className="relative hidden w-full max-w-md sm:block lg:ml-0">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="search"
                            placeholder="Search documents..."
                            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                        />
                    </div>

                </div>

                {/* Right */}
                <div className="ml-auto flex items-center gap-2 sm:gap-3">

                    {/* Notifications */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <Bell size={19} />

                        <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-brand-600" />
                    </button>

                    {/* User */}
                    <UserMenu />

                </div>

            </header>
        </>
    );
}