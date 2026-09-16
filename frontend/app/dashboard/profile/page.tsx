"use client";

import { CalendarDays, Mail, User } from "lucide-react";

import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
    const { user } = useAuth();

    const createdAt = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "—";

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-xl">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-950">
                        Profile
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Your DocsQuery account information.
                    </p>

                    <div className="mt-6 space-y-4">
                        {/* Name */}
                        <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                                <User size={18} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-400">
                                    Name
                                </p>
                                <p className="mt-1 truncate text-sm font-medium text-gray-900">
                                    {user?.name ?? "User"}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                                <Mail size={18} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-400">
                                    Email
                                </p>
                                <p className="mt-1 truncate text-sm font-medium text-gray-900">
                                    {user?.email ?? "user@example.com"}
                                </p>
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                                <CalendarDays size={18} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-400">
                                    Member since
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {createdAt}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}