"use client";

import Link from "next/link";
import { FileText, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/auth-context";

import {
    mainNavigation,
    accountNavigation,
    isNavigationItemActive,
} from "./dashboard-nav";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const initials = user?.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "U";

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 hidden overflow-visible border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out lg:flex lg:flex-col ${collapsed ? "w-20" : "w-64"
                }`}
        >
            <div
                className={`relative flex h-16 min-w-0 items-center border-b border-gray-100 ${collapsed ? "justify-center px-2" : "px-6"
                    }`}
            >
                <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <FileText size={19} />
                    </div>

                    {!collapsed && (
                        <span className="text-lg font-bold tracking-tight text-gray-950">
                            Docs<span className="text-brand-600">Query</span>
                        </span>
                    )}
                </Link>

                {/* Floating toggle — pinned to the sidebar's edge so it never
                    competes with the logo for space in the collapsed rail. */}
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="absolute right-0 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
                >
                    {collapsed ? (
                        <PanelLeftOpen size={13} />
                    ) : (
                        <PanelLeftClose size={13} />
                    )}
                </button>
            </div>

            <div
                className={`flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto py-6 ${collapsed ? "px-2" : "px-3"
                    }`}
            >
                {!collapsed && (
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Workspace
                    </p>
                )}

                <nav className="space-y-1">
                    {mainNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isNavigationItemActive(pathname, item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={`flex min-w-0 items-center rounded-xl py-2.5 text-sm font-medium transition ${collapsed ? "justify-center px-3" : "gap-3 px-3"
                                    } ${active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={18} />

                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {!collapsed && (
                    <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Account
                    </p>
                )}

                <nav className="space-y-1">
                    {accountNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isNavigationItemActive(pathname, item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={`flex min-w-0 items-center rounded-xl py-2.5 text-sm font-medium transition ${collapsed ? "justify-center px-3" : "gap-3 px-3"
                                    } ${active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={18} />

                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className={`border-t border-gray-100 ${collapsed ? "p-3" : "p-4"}`}>
                <div
                    className={`flex items-center rounded-xl p-2 ${collapsed ? "justify-center" : "gap-3"
                        }`}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        {initials}
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                                {user?.name ?? "User"}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                                {user?.email ?? "user@example.com"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}