import Link from "next/link";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
    children: ReactNode;
    mode: "login" | "register";
}

export function AuthShell({ children, mode }: AuthShellProps) {
    const isLogin = mode === "login";

    return (
        <div className="w-full max-w-sm">

            <Link href="/" className="mb-8 flex items-center justify-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <FileText size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight text-gray-950">
                    Docs<span className="text-brand-600">Query</span>
                </span>
            </Link>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                {children}

                <p className="mt-6 text-center text-sm text-gray-500">
                    {isLogin ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
                                Create one
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                                Sign in
                            </Link>
                        </>
                    )}
                </p>
            </div>

        </div>
    );
}