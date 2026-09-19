"use client";

import {
    FileText,
    HardDrive,
    MessageCircle,
    MoreVertical,
    Send,
    Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StatCard } from "@/components/dashboard/stats-card";
import { useAuth } from "@/context/auth-context";
import { getDashboardStats } from "@/lib/api/dashboard";


const recentDocuments = [
    {
        name: "Project Documentation.pdf",
        type: "PDF",
        size: "2.4 MB",
        status: "Ready",
        uploaded: "2 hours ago",
    },
    {
        name: "Resume.docx",
        type: "DOCX",
        size: "1.1 MB",
        status: "Ready",
        uploaded: "Yesterday",
    },
    {
        name: "Notes.txt",
        type: "TXT",
        size: "12 KB",
        status: "Processing",
        uploaded: "2 days ago",
    },
];

const suggestedQuestions = [
    "Summarize this document",
    "What are the key points?",
    "Give me a detailed explanation",
];

function formatStorage(bytes: number) {
    if (bytes === 0) return "0 MB";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DashboardPage() {
    const router = useRouter();
    const { token, user } = useAuth();
    const [question, setQuestion] = useState("");
    const [dashboardStats, setDashboardStats] = useState({
        documents: 0,
        questions: 0,
        storageBytes: 0,
    });
    const displayName = user?.name?.split(" ")[0] ?? "there";

    useEffect(() => {
        if (!token) return;

        let cancelled = false;
        void getDashboardStats(token)
            .then((stats) => {
                if (!cancelled) setDashboardStats(stats);
            })
            .catch(() => {
                if (!cancelled) toast.error("Failed to load dashboard stats");
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    const goToUpload = () => {
        router.push("/dashboard/documents");
    }
    const goToChat = () => {
        router.push("/dashboard/chat");
    };

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                        Welcome back, {displayName} 👋
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Here&apos;s what&apos;s happening with your documents.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <button
                        type="button"
                        onClick={goToUpload}

                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Upload size={17} />
                        Go To Upload Document
                    </button>
                </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Documents"
                    value={String(dashboardStats.documents)}
                    description="Uploaded documents"
                    icon={<FileText size={20} />}
                />

                <StatCard
                    title="Questions asked"
                    value={String(dashboardStats.questions)}
                    description="Total questions"
                    icon={<MessageCircle size={20} />}
                />

                <StatCard
                    title="Storage used"
                    value={formatStorage(dashboardStats.storageBytes)}
                    description="Of 100 MB available"
                    icon={<HardDrive size={20} />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {/* Recent documents — restyled as a table like the target design */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-docs-card lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-950">
                                Sample documents
                            </h2>
                        </div>
                    </div>

                    {/* Table view — sm and up */}
                    <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-medium text-gray-400">
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium">Type</th>
                                    <th className="px-5 py-3 font-medium">Size</th>
                                    <th className="px-5 py-3 font-medium">Uploaded</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {recentDocuments.map((document) => (
                                    <tr
                                        key={document.name}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-red-600">
                                                    <FileText size={17} />
                                                </div>

                                                <p className="truncate text-sm font-medium text-gray-900">
                                                    {document.name}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {document.type}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {document.size}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {document.uploaded}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                                aria-label={`More actions for ${document.name}`}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Stacked card view — below sm, where a table can't fit */}
                    <div className="divide-y divide-gray-100 sm:hidden">
                        {recentDocuments.map((document) => (
                            <div
                                key={document.name}
                                className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-gray-50"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-red-600">
                                        <FileText size={19} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {document.name}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-gray-400">
                                            {document.type} · {document.size} · {document.uploaded}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                    aria-label={`More actions for ${document.name}`}
                                >
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start a conversation — hands off to the Chat / Ask page rather than
                    answering inline on the dashboard */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-docs-card">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={18} className="text-brand-600" />
                        <h2 className="font-semibold text-gray-950">
                            Start a Conversation
                        </h2>
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                        Ask questions about your documents.
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") goToChat();
                            }}
                            placeholder="Type your question here..."
                            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />

                        <button
                            type="button"
                            onClick={goToChat}
                            aria-label="Go to Chat / Ask"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700"
                        >
                            <Send size={16} />
                        </button>
                    </div>

                    <div className="mt-4">
                        <p className="text-xs text-gray-400">Try asking:</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {suggestedQuestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => setQuestion(suggestion)}
                                    className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={goToChat}
                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Go to Chat / Ask
                    </button>
                </div>
            </div>
        </div>
    );
}