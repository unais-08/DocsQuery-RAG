"use client";

import { useState } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
                />

                <div
                    className={`transition-[padding] duration-300 ease-in-out ${
                        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
                    }`}
                >
                    <Navbar />

                    <main className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}