"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    FileText,
    MoreVertical,
    Pencil,
    Trash2,
    Share2,
    ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import {
    deleteConversation,
    getConversations,
    updateConversation,
    type ConversationListItem,
} from "@/lib/api/conversations";

type ChatHistoryItem = ConversationListItem;

const PAGE_SIZE = 6;

export default function ChatHistoryPage() {
    const { token, loading: authLoading } = useAuth();
    const router = useRouter();
    const [chats, setChats] = useState<ChatHistoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [page, setPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || authLoading) return;
        void getConversations(token)
            .then((response) => setChats(response.conversations))
            .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Failed to load history."))
            .finally(() => setLoading(false));
    }, [authLoading, token]);

    const filteredChats = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = chats.filter((chat) => {
            return !query || chat.title.toLowerCase().includes(query);
        });

        return [...filtered].sort((a, b) =>
            sortOrder === "newest"
                ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
    }, [chats, search, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredChats.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageChats = filteredChats.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        setPage(1);
    }

    async function handleDelete(chat: ChatHistoryItem) {
        setOpenMenuId(null);
        const confirmed = window.confirm(`Delete "${chat.title}"? This can't be undone.`);
        if (!confirmed) return;

        if (!token) return;
        setDeletingId(chat.id);
        try {
            await deleteConversation(chat.id, token);
            setChats((prev) => prev.filter((c) => c.id !== chat.id));
            toast.success("Conversation deleted.");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to delete conversation.");
        } finally {
            setDeletingId(null);
        }
    }

    async function handleRename(chat: ChatHistoryItem) {
        setOpenMenuId(null);
        if (!token) return;
        const title = window.prompt("Conversation title", chat.title)?.trim();
        if (!title || title === chat.title) return;
        try {
            const response = await updateConversation(chat.id, title, token);
            setChats((prev) => prev.map((item) => item.id === chat.id ? { ...item, ...response.conversation } : item));
            toast.success("Conversation renamed.");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to rename conversation.");
        }
    }

    function startNewChat() {
        router.push("/dashboard/chat");
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
            <div className="overflow-visible rounded-docs-lg border border-border bg-surface shadow-docs-card">
                {loading ? (
                    <p className="px-4 py-10 text-center text-sm text-text-muted">Loading conversations...</p>
                ) : pageChats.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-text-muted">
                        No conversations match your search.
                    </p>
                ) : (
                    pageChats.map((chat, index) => (
                        <div
                            key={chat.id}
                            className={`relative flex items-center gap-3 px-4 py-3.5 transition-opacity hover:bg-background ${index !== pageChats.length - 1 ? "border-b border-border" : ""
                                } ${openMenuId === chat.id ? "z-30" : "z-0"
                                } ${deletingId === chat.id ? "pointer-events-none opacity-50" : ""}`}
                        >
                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-docs-sm bg-docs-blue-50 text-red-500">
                                <FileText size={16} />
                            </div>

                            <button
                                type="button"
                                onClick={() => router.push(`/dashboard/chat?conversationId=${chat.id}`)}
                                className="min-w-0 flex-1 text-left"
                            >
                                <p className="truncate text-sm font-medium">{chat.title}</p>
                                <p className="truncate text-xs text-text-muted">{new Date(chat.updatedAt).toLocaleString()}</p>
                            </button>

                            <span className="hidden flex-none text-xs text-text-muted sm:block">
                                {chat.messageCount} messages
                            </span>
                            <span className="hidden flex-none text-xs text-text-muted md:block">                            {new Date(chat.updatedAt).toLocaleString()}</span>

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
        </div>
    );
}