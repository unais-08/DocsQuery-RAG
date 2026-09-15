"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

export function UserMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">

            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    T
                </div>

                <ChevronDown
                    size={16}
                    className="hidden text-gray-400 sm:block"
                />
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">

                    <div className="border-b border-gray-100 px-3 py-2.5">
                        <p className="text-sm font-semibold text-gray-900">
                           Test User
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                            you@example.com
                        </p>
                    </div>

                    <button
                        type="button"
                        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        <User size={17} />
                        Profile
                    </button>

                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        <Settings size={17} />
                        Settings
                    </button>

                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>

                </div>
            )}

        </div>
    );
}