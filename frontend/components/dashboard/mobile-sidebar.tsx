"use client";

import Link from "next/link";
import { FileText, X } from "lucide-react";
import { usePathname } from "next/navigation";

import {
    mainNavigation,
    accountNavigation,
} from "./dashboard-nav";

interface MobileSidebarProps {
    open: boolean;
    onClose: () => void;
}

export function MobileSidebar({
    open,
    onClose,
}: MobileSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${open
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >

                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">

                    <Link
                        href="/dashboard"
                        onClick={onClose}
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                            <FileText size={19} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-gray-950">
                            Docs<span className="text-brand-600">Query</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Navigation */}
                <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6">

                    {/* Workspace */}
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
                                    onClick={onClose}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                            ? "bg-brand-50 text-brand-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={19} />

                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                    </nav>

                    {/* Account */}
                    <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Account
                    </p>

                    <nav className="space-y-1">

                        {accountNavigation.map((item) => {
                            const Icon = item.icon;

                            const active =
                                pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                            ? "bg-brand-50 text-brand-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={19} />

                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                    </nav>

                </div>

                {/* User */}
                <div className="border-t border-gray-100 p-4">

                    <div className="flex items-center gap-3 rounded-xl p-2">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                            U
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                                John Doe
                            </p>

                            <p className="truncate text-xs text-gray-500">
                                you@example.com
                            </p>
                        </div>

                    </div>

                </div>

            </aside>
        </>
    );
}