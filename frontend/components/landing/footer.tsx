import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:px-6 md:flex-row md:justify-between md:gap-6 md:text-left lg:px-8">

                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                        <FileText size={16} />
                    </div>

                    <span className="font-bold text-gray-950">
                        Docs<span className="text-brand-600">Query</span>
                    </span>
                </Link>

                <p className="text-xs text-gray-400">
                    Project made for learning purpose
                </p>

                <p className="text-xs text-gray-400">
                    © {new Date().getFullYear()} DocsQuery
                </p>

            </div>

        </footer>
    );
}