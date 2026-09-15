"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    FileText,
    Home,
    MessageCircle,
    Settings,
    Sparkles,
} from "lucide-react";

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        name: "Documents",
        href: "/dashboard/documents",
        icon: FileText,
    },
    {
        name: "Q&A",
        href: "/dashboard/chat",
        icon: MessageCircle,
    },
    {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
];

const secondaryNavigation = [
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">

            {/* Logo */}
            <div className="flex h-16 items-center border-b border-gray-100 px-6">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                        <FileText size={19} />
                    </div>

                    <span className="text-lg font-bold tracking-tight text-gray-950">
                        Docs<span className="text-brand-600">Query</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col px-3 py-6">

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Workspace
                </p>

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        const active =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={18} />

                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Account
                </p>

                <nav className="space-y-1">
                    {secondaryNavigation.map((item) => {
                        const Icon = item.icon;

                        const active = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={18} />

                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

            </div>

            {/* Bottom user */}
            <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3 rounded-xl p-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        U
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                            Test User
                        </p>

                        <p className="truncate text-xs text-gray-500">
                            test@example.com
                        </p>
                    </div>
                </div>
            </div>

        </aside>
    );
}