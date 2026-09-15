import Link from "next/link";
import {
    ArrowRight,
    Check,
    FileText,
    MessageCircle,
    Sparkles,
} from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Background glow */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl gap-16 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-28 lg:pt-20">

                {/* Left */}
                <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3  text-sm font-medium text-brand-700">
                        <Sparkles size={15} />
                        AI-powered document Q&A
                    </div>

                    <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-950 sm:text-5xl lg:text-[3.4rem]">
                        Ask your documents{" "}
                        <span className="relative inline-block whitespace-nowrap">
                            anything
                            <svg
                                viewBox="0 0 200 14"
                                preserveAspectRatio="none"
                                className="absolute -bottom-2 left-0 h-3 w-full text-brand-400"
                                aria-hidden="true"
                            >
                                <path
                                    d="M2 9.5C40 3 90 2 100 6C110 10 160 11 198 4.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>.
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg lg:mx-0">
                        Upload your PDFs, notes, and documents. Ask questions
                        in natural language and get accurate, source-backed
                        answers in seconds — no more digging through pages
                        to find what you need.
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                        <Link
                            href="/register"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-xl shadow-brand-600/20 transition hover:bg-brand-700"
                        >
                            Let's get started
                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            href="#how-it-works"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            See how it works
                        </Link>
                    </div>

                    {/* Trust */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
                        <TrustItem text="Source-backed answers" />
                        <TrustItem text="Private documents" />
                        <TrustItem text="Easy to use" />
                    </div>


                </div>

                {/* Right product preview */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-brand-200/40 to-blue-200/40 blur-2xl" />

                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10">

                        {/* Fake browser header */}
                        <div className="flex h-12 items-center gap-2 border-b border-gray-100 px-4">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                            <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                            <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                        </div>

                        <div className="grid grid-cols-[130px_1fr]">

                            {/* Mini sidebar */}
                            <div className="hidden border-r border-gray-100 bg-gray-50/70 p-3 sm:block">
                                <div className="mb-6 flex items-center gap-2 px-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                                        <FileText size={14} />
                                    </div>

                                    <span className="text-xs font-bold">
                                        Docs
                                        <span className="text-brand-600">
                                            Query
                                        </span>
                                    </span>
                                </div>

                                <div className="space-y-1 text-xs">
                                    <div className="rounded-lg bg-brand-50 px-2 py-2 font-medium text-brand-700">
                                        Dashboard
                                    </div>

                                    <div className="px-2 py-2 text-gray-500">
                                        Documents
                                    </div>

                                    <div className="px-2 py-2 text-gray-500">
                                        Q&A
                                    </div>

                                    <div className="px-2 py-2 text-gray-500">
                                        Analytics
                                    </div>
                                </div>
                            </div>

                            {/* Chat preview */}
                            <div className="col-span-2 p-5 sm:col-span-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            Ask your documents
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            3 documents selected
                                        </p>
                                    </div>

                                    <MessageCircle
                                        size={18}
                                        className="text-brand-600"
                                    />
                                </div>

                                {/* Question */}
                                <div className="ml-auto mt-8 max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-3 text-sm text-white">
                                    What is the main conclusion of this
                                    research?
                                </div>

                                {/* Answer */}
                                <div className="mt-4 max-w-[90%] rounded-2xl rounded-bl-md border border-gray-100 bg-gray-50 p-4">
                                    <p className="text-sm leading-6 text-gray-700">
                                        The research concludes that combining
                                        retrieval with language models improves
                                        the accuracy and reliability of
                                        document-based question answering.
                                    </p>

                                    {/* Sources */}
                                    <div className="mt-4 border-t border-gray-200 pt-3">
                                        <p className="text-xs font-semibold text-gray-500">
                                            Sources
                                        </p>

                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-gray-600">
                                                <FileText
                                                    size={14}
                                                    className="text-red-500"
                                                />
                                                research-paper.pdf · Page 12
                                            </div>

                                            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-gray-600">
                                                <FileText
                                                    size={14}
                                                    className="text-red-500"
                                                />
                                                methodology.pdf · Page 8
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Input */}
                                <div className="mt-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
                                    <input
                                        disabled
                                        placeholder="Ask a follow-up question..."
                                        className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none"
                                    />

                                    <button
                                        type="button"
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white"
                                    >
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TrustItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Check size={11} />
            </div>

            {text}
        </div>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center lg:text-left">
            <p className="text-xl font-bold text-gray-950 sm:text-2xl">
                {value}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
        </div>
    );
}