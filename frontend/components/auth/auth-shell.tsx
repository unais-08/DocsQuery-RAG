import Link from "next/link";
import { FileText, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
    children: ReactNode;
    mode: "login" | "register";
}

export function AuthShell({ children, mode }: AuthShellProps) {
    const isLogin = mode === "login";

    return (
        <div className="min-h-screen p-3 sm:p-6 lg:p-8">
            <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-docs-auth backdrop-blur-xl sm:rounded-3xl sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">

                {/* Left marketing section */}
                <section className="relative hidden overflow-hidden bg-gradient-to-br from-brand-50 via-white to-docs-blue-50 p-12 lg:flex lg:w-1/2 lg:flex-col">

                    {/* Decorative blobs */}
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
                    <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-docs-blue-200/40 blur-3xl" />

                    <div className="relative z-10 flex h-full flex-col">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex w-fit items-center gap-2"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
                                <FileText size={20} />
                            </div>

                            <span className="text-xl font-bold tracking-tight text-gray-950">
                                Docs<span className="text-brand-600">Query</span>
                            </span>
                        </Link>

                        {/* Hero */}
                        <div className="my-auto max-w-lg">

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-brand-700">
                                <Sparkles size={15} />
                                AI-powered document search
                            </div>

                            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 xl:text-5xl">
                                Your documents.
                                <br />
                                <span className="text-brand-600">
                                    Smarter answers.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-md text-base leading-7 text-gray-600">
                                Upload your documents and ask questions using AI.
                                Get accurate, source-backed answers from your own
                                knowledge base.
                            </p>

                            {/* Features */}
                            <div className="mt-10 space-y-5">

                                <Feature
                                    icon={<FileText size={18} />}
                                    title="Upload your documents"
                                    description="PDF, DOCX, TXT and more"
                                />

                                <Feature
                                    icon={<MessageCircle size={18} />}
                                    title="Ask anything"
                                    description="Chat naturally with your documents"
                                />

                                <Feature
                                    icon={<ShieldCheck size={18} />}
                                    title="Source-backed answers"
                                    description="See where every answer came from"
                                />

                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Smarter documents. Brighter decisions.
                        </p>
                    </div>
                </section>

                {/* Form section */}
                <section className="flex w-full items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:w-1/2 lg:px-12 lg:py-14">
                    <div className="w-full max-w-[27rem]">

                        {/* Mobile logo */}
                        <div className="mb-8 flex justify-center sm:mb-10 lg:hidden">
                            <Link
                                href="/"
                                className="flex items-center gap-2"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                                    <FileText size={20} />
                                </div>

                                <span className="text-xl font-bold">
                                    Docs<span className="text-brand-600">Query</span>
                                </span>
                            </Link>
                        </div>

                        {children}

                        {/* Switch auth page */}
                        <p className="mt-7 text-center text-sm text-gray-500">
                            {isLogin ? (
                                <>
                                    Don't have an account?{" "}
                                    <Link
                                        href="/register"
                                        className="font-semibold text-brand-600 hover:text-brand-700"
                                    >
                                        Create one
                                    </Link>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-brand-600 hover:text-brand-700"
                                    >
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </p>

                    </div>
                </section>
            </div>
        </div>
    );
}

function Feature({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-gray-100">
                {icon}
            </div>

            <div>
                <p className="font-semibold text-gray-900">
                    {title}
                </p>

                <p className="mt-0.5 text-sm text-gray-500">
                    {description}
                </p>
            </div>
        </div>
    );
}