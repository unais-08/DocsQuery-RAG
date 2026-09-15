"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/auth-context";

import {
    mainNavigation,
    accountNavigation,
} from "./dashboard-nav";

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const initials = user?.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "U";

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">
            <div className="flex h-16 items-center border-b border-gray-100 px-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <FileText size={19} />
                    </div>

                    <span className="text-lg font-bold tracking-tight text-gray-950">
                        Docs<span className="text-brand-600">Query</span>
                    </span>
                </Link>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Workspace
                </p>

                <nav className="space-y-1">
                    {mainNavigation.map((item) => {
                        const Icon = item.icon;
                        const active =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                    active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <Icon size={18} />

                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Account
                </p>

                <nav className="space-y-1">
                    {accountNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                    active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <Icon size={18} />

                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3 rounded-xl p-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                            {user?.name ?? "User"}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                            {user?.email ?? "user@example.com"}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}