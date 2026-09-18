"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import {
    Search,
    Plus,
    FileText,
    MoreVertical,
    Pencil,
    Trash2,
    Share2,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
} from "lucide-react";

type ChatHistoryItem = {
    id: string;
    title: string;
    documentName: string;
    messageCount: number;
    date: string;
    timestamp: number;
};

const INITIAL_CHATS: ChatHistoryItem[] = [
    { id: "c1", title: "Summarize the main findings of this report", documentName: "Research_Paper.pdf", messageCount: 8, date: "Sep 18, 2025 10:24 AM", timestamp: 1758184440000 },
    { id: "c2", title: "What are the key features of our product?", documentName: "Product_Documentation.pdf", messageCount: 12, date: "Sep 17, 2025 08:15 PM", timestamp: 1758132900000 },
    { id: "c3", title: "Explain the system architecture", documentName: "Technical_Design_Doc.pdf", messageCount: 10, date: "Sep 16, 2025 04:30 PM", timestamp: 1758040200000 },
    { id: "c4", title: "How to set up the project locally", documentName: "README.md", messageCount: 6, date: "Sep 15, 2025 11:20 AM", timestamp: 1757935200000 },
    { id: "c5", title: "Compare the different pricing plans", documentName: "Business_Proposal.pdf", messageCount: 14, date: "Sep 14, 2025 09:45 PM", timestamp: 1757878500000 },
    { id: "c6", title: "What does this error mean and how to fix it?", documentName: "Troubleshooting_Guide.pdf", messageCount: 9, date: "Sep 13, 2025 02:10 PM", timestamp: 1757772600000 },
    { id: "c7", title: "Extract important dates from this document", documentName: "Meeting_Notes.pdf", messageCount: 7, date: "Sep 12, 2025 06:35 PM", timestamp: 1757699700000 },
    { id: "c8", title: "Summarize this document in bullet points", documentName: "Client_Report.pdf", messageCount: 11, date: "Sep 11, 2025 01:12 PM", timestamp: 1757595120000 },
    { id: "c9", title: "What are the security considerations?", documentName: "Security_Guidelines.pdf", messageCount: 8, date: "Sep 10, 2025 10:50 AM", timestamp: 1757501400000 },
    { id: "c10", title: "Give me a TL;DR of this document", documentName: "Long_Article.pdf", messageCount: 5, date: "Sep 9, 2025 03:22 PM", timestamp: 1757430120000 },
    { id: "c11", title: "List the action items from the call", documentName: "Meeting_Notes.pdf", messageCount: 6, date: "Sep 8, 2025 09:05 AM", timestamp: 1757322300000 },
    { id: "c12", title: "What's the refund policy?", documentName: "Business_Proposal.pdf", messageCount: 4, date: "Sep 7, 2025 05:48 PM", timestamp: 1757260080000 },
];

const PAGE_SIZE = 6;

/**
 * Placeholder for the real delete endpoint.
 * Swap the body for your actual request — the row already
 * optimistically disables itself while this is pending.
 */
async function deleteChatRequest(id: string): Promise<{ success: true }> {
    console.log("[QueryDocs] DELETE /api/chats/" + id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
}

export default function ChatHistoryPage() {
    const [chats, setChats] = useState<ChatHistoryItem[]>(INITIAL_CHATS);
    const [search, setSearch] = useState("");
    const [documentFilter, setDocumentFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [page, setPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const documentOptions = useMemo(
        () => Array.from(new Set(chats.map((c) => c.documentName))).sort(),
        [chats]
    );

    const filteredChats = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = chats.filter((chat) => {
            const matchesQuery =
                !query ||
                chat.title.toLowerCase().includes(query) ||
                chat.documentName.toLowerCase().includes(query);
            const matchesDocument = documentFilter === "all" || chat.documentName === documentFilter;
            return matchesQuery && matchesDocument;
        });

        return [...filtered].sort((a, b) =>
            sortOrder === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
        );
    }, [chats, search, documentFilter, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredChats.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageChats = filteredChats.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        setPage(1);
    }

    function handleDocumentFilterChange(e: ChangeEvent<HTMLSelectElement>) {
        setDocumentFilter(e.target.value);
        setPage(1);
    }

    async function handleDelete(chat: ChatHistoryItem) {
        setOpenMenuId(null);
        const confirmed = window.confirm(`Delete "${chat.title}"? This can't be undone.`);
        if (!confirmed) return;

        setDeletingId(chat.id);
        await deleteChatRequest(chat.id);
        setChats((prev) => prev.filter((c) => c.id !== chat.id));
        setDeletingId(null);
    }

    function handleRename(chat: ChatHistoryItem) {
        setOpenMenuId(null);
        // TODO: open a real rename dialog and call your rename endpoint.
        console.log("[QueryDocs] rename requested ->", chat.id);
    }

    function handleShare(chat: ChatHistoryItem) {
        setOpenMenuId(null);
        // TODO: wire up your real share flow.
        console.log("[QueryDocs] share requested ->", chat.id);
    }

    function startNewChat() {
        // TODO: route to a fresh chat, e.g. router.push("/dashboard/chat")
        console.log("[QueryDocs] new chat requested");
    }

    return (
        <div className="text-text-primary">
            {/* header */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Chat History</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        View and manage your past conversations with your documents.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={startNewChat}
                    className="flex items-center gap-1.5 rounded-docs-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                    <Plus size={16} />
                    New Chat
                </button>
            </div>

            {/* filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search chat history..."
                        className="w-full rounded-docs-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-400"
                    />
                </div>

                <select
                    value={documentFilter}
                    onChange={handleDocumentFilterChange}
                    className="rounded-docs-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary outline-none focus:border-brand-400"
                >
                    <option value="all">All Documents</option>
                    {documentOptions.map((doc) => (
                        <option key={doc} value={doc}>
                            {doc}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() => {
                        setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
                        setPage(1);
                    }}
                    className="flex items-center gap-1.5 rounded-docs-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary hover:bg-background"
                >
                    <ArrowUpDown size={14} />
                    {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                </button>
            </div>

            {/* list */}
            <div className="overflow-hidden rounded-docs-lg border border-border bg-surface shadow-docs-card">
                {pageChats.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-text-muted">
                        No conversations match your search.
                    </p>
                ) : (
                    pageChats.map((chat, index) => (
                        <div
                            key={chat.id}
                            className={`flex items-center gap-3 px-4 py-3.5 transition-opacity hover:bg-background ${index !== pageChats.length - 1 ? "border-b border-border" : ""
                                } ${deletingId === chat.id ? "pointer-events-none opacity-50" : ""}`}
                        >
                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-docs-sm bg-docs-blue-50 text-docs-blue-600">
                                <FileText size={16} />
                            </div>

                            <button
                                type="button"
                                onClick={() => console.log("[QueryDocs] open chat ->", chat.id)}
                                className="min-w-0 flex-1 text-left"
                            >
                                <p className="truncate text-sm font-medium">{chat.title}</p>
                                <p className="truncate text-xs text-text-muted">{chat.documentName}</p>
                            </button>

                            <span className="hidden flex-none text-xs text-text-muted sm:block">
                                {chat.messageCount} messages
                            </span>
                            <span className="hidden flex-none text-xs text-text-muted md:block">{chat.date}</span>

                            <div className="relative flex-none">
                                <button
                                    type="button"
                                    onClick={() => setOpenMenuId((prev) => (prev === chat.id ? null : chat.id))}
                                    className="rounded-docs-sm p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {openMenuId === chat.id && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                        <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-docs-md border border-border bg-surface shadow-docs-card">
                                            <button
                                                type="button"
                                                onClick={() => handleRename(chat)}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-background"
                                            >
                                                <Pencil size={14} />
                                                Rename
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleShare(chat)}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-background"
                                            >
                                                <Share2 size={14} />
                                                Share
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(chat)}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-background"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* pagination */}
            {filteredChats.length > 0 && (
                <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
                    <span>
                        Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                        {Math.min(currentPage * PAGE_SIZE, filteredChats.length)} of {filteredChats.length} chats
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="rounded-docs-sm border border-border p-1.5 text-text-secondary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={15} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setPage(num)}
                                className={`h-7 w-7 rounded-docs-sm text-xs font-medium ${num === currentPage
                                        ? "bg-brand-600 text-white"
                                        : "text-text-secondary hover:bg-surface"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded-docs-sm border border-border p-1.5 text-text-secondary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}