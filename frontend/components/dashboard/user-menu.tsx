"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/context/auth-context";

export function UserMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();

    const initials = user?.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "U";

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/login");
        } catch {
            router.replace("/login");
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {initials}
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
                            {user?.name ?? "User"}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                            {user?.email ?? "user@example.com"}
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
                        onClick={handleLogout}
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