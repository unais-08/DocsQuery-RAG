import {
    BarChart3,
    Clock,
    FileText,
    Home,
    MessageCircle,
    Settings,
} from "lucide-react";

export const mainNavigation = [
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
    }, {
        name: "Chat History",
        href: "/dashboard/history",
        icon: Clock,
    },
    {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
];

export const accountNavigation = [
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function isNavigationItemActive(pathname: string, href: string) {
    if (href === "/dashboard") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}