"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#faq", label: "FAQ" },
];

export function LandingNavbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <FileText size={19} />
                    </div>

                    <span className="text-lg font-bold tracking-tight text-gray-950">
                        Docs<span className="text-brand-600">Query</span>
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 sm:flex">
                    <Link
                        href="/login"
                        className="px-3 py-2 text-sm font-semibold text-gray-700 transition hover:text-gray-950"
                    >
                        Sign in
                    </Link>

                    <Link
                        href="/register"
                        className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                    >
                        Get started
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 sm:hidden"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile panel */}
            {open && (
                <div className="border-t border-gray-100 bg-white px-4 pb-6 pt-2 sm:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Sign in
                        </Link>

                        <Link
                            href="/register"
                            onClick={() => setOpen(false)}
                            className="rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}