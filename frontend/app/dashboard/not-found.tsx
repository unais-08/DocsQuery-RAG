import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function DashboardNotFound() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <div className="w-full max-w-md text-center">

                {/* Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <FileQuestion size={38} strokeWidth={1.7} />
                </div>

                {/* 404 */}
                <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-brand-600">
                    Error 404
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                    Page not found
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Sorry, we couldn't find the page you're looking for.
                    It may have been moved or doesn't exist anymore.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                    <Link
                        href="/dashboard"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                    >
                        <Home size={17} />
                        Back to dashboard
                    </Link>
                </div>

            </div>
        </div>
    );
}