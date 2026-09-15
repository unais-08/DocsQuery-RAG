import Link from "next/link";
import { ArrowRight, Check, FileText } from "lucide-react";

const readyFiles = [
    "research-paper.pdf",
    "methodology.docx",
    "field-notes.txt",
];

export function CTA() {
    return (
        <section className="bg-gray-950 py-20 sm:py-28">

            <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:px-8">

                {/* Left: message + action */}
                <div className="text-center lg:text-left">

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                        Stop searching your documents.
                        <br className="hidden sm:block" />
                        Start asking them.
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-400 lg:mx-0">
                        Upload what you have, ask what you need to know, and
                        get an answer with the exact page it came from.
                    </p>

                    <Link
                        href="/register"
                        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-xl shadow-brand-600/30 transition hover:bg-brand-500"
                    >
                        Get started
                        <ArrowRight size={17} />
                    </Link>

                </div>

                {/* Right: files-ready visual */}
                <div className="mx-auto w-full max-w-sm lg:mx-0">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

                        <p className="text-xs font-medium text-gray-500">
                            3 documents ready
                        </p>

                        <div className="mt-4 space-y-2">
                            {readyFiles.map((file) => (
                                <div
                                    key={file}
                                    className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950 px-3 py-2.5"
                                >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600/15 text-brand-400">
                                        <FileText size={14} />
                                    </div>
                                    <span className="flex-1 truncate text-sm text-gray-300">
                                        {file}
                                    </span>
                                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                                        <Check size={10} />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>

        </section>
    );
}