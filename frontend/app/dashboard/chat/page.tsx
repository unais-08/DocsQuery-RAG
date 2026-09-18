"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import {
    FileText,
    Plus,
    Paperclip,
    Send,
    Copy,
    RefreshCw,
    ThumbsUp,
    ThumbsDown,
    X,
    Sparkles,
    MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import {
    getDocuments,
    uploadDocument,
    validateDocumentFile,
    type Document,
} from "@/lib/api/documents";
import { queryDocuments } from "@/lib/api/query";

type Feedback = "up" | "down" | null;

type ChatMessage = {
    id: number;
    role: "user" | "assistant";
    content: string;
    sources?: string[];
    sourcesOpen?: boolean;
    feedback?: Feedback;
};

type DocSource = {
    id: string;
    name: string;
    size: string;
};

function toDocSource(document: Document): DocSource {
    return {
        id: document.id,
        name: document.name,
        size: `${(document.size / (1024 * 1024)).toFixed(1)} MB`,
    };
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error && error.message ? error.message : fallback;
}

let messageIdCounter = 100;
function nextId(): number {
    messageIdCounter += 1;
    return messageIdCounter;
}

// Adjust to match your <Navbar /> height so the chat fills the rest of
// the viewport exactly. Tailwind's default h-16 (used in most dashboard
// navbars) is 4rem — change the literal below if yours differs.
const CHAT_HEIGHT_CLASS = "h-[calc(100dvh-4rem)]";

export default function DocsChatPage() {
    const { token, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [documents, setDocuments] = useState<DocSource[]>([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;
        void getDocuments(token)
            .then((response) => {
                if (!cancelled) setDocuments(response.documents.map(toDocSource));
            })
            .catch((error: unknown) => {
                if (!cancelled) toast.error(getErrorMessage(error, "Failed to load documents."));
            })
            .finally(() => {
                if (!cancelled) setDocumentsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isSending]);

    // Auto-grow the textarea as the person types, capped so it never
    // pushes the send button off screen; resets on clear/send too.
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [input]);

    async function runQuery(query: string) {
        if (!query.trim() || documents.length === 0 || !token || isSending) return;

        const question = query.trim();
        const userMessage: ChatMessage = { id: nextId(), role: "user", content: question };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsSending(true);

        try {
            const result = await queryDocuments({ question }, token);
            setMessages((prev) => [
                ...prev,
                {
                    id: nextId(),
                    role: "assistant",
                    content: result.answer,
                    sources: result.sources.map((source) =>
                        `${source.documentName}${source.pageNumber ? `, p. ${source.pageNumber}` : ""}`,
                    ),
                    sourcesOpen: false,
                    feedback: null,
                },
            ]);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to get an answer."));
        } finally {
            setIsSending(false);
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        runQuery(input);
    }

    function handleRegenerate(assistantId: number) {
        const index = messages.findIndex((m) => m.id === assistantId);
        const lastUser = [...messages.slice(0, index)].reverse().find((m) => m.role === "user");
        if (!lastUser) return;
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        runQuery(lastUser.content);
    }

    function handleCopy(content: string) {
        navigator.clipboard?.writeText(content).catch(() => {});
    }

    function toggleSources(id: number) {
        setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, sourcesOpen: !m.sourcesOpen } : m))
        );
    }

    function setFeedback(id: number, value: Feedback) {
        setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === value ? null : value } : m))
        );
    }

    function removeDocument(id: string) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
    }

    async function handleFilesPicked(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        const file = files[0];
        e.target.value = "";
        if (!file) return;

        const validationError = validateDocumentFile(file);
        if (validationError) {
            toast.error(validationError);
            return;
        }
        if (!token) {
            toast.error("Your session has expired. Please sign in again.");
            return;
        }

        setUploading(true);
        try {
            const response = await uploadDocument(file, token);
            setDocuments((prev) => [toDocSource(response.document), ...prev]);
            toast.success("Document uploaded successfully.");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to upload document."));
        } finally {
            setUploading(false);
        }
    }

    function startNewChat() {
        setMessages([]);
    }

    return (
        // Negative vertical margin cancels the dashboard <main>'s own
        // padding (p-4 sm:p-6 lg:p-8) so this page can use the full
        // available height for its own scroll region below.
        <div className={`-my-4 sm:-my-6 lg:-my-8 flex ${CHAT_HEIGHT_CLASS} flex-col bg-background text-text-primary`}>
            {/* documents + new chat */}
            <div className="flex flex-none items-center gap-3 border-b border-border bg-surface px-4 py-2.5 sm:px-6 lg:px-8">
                <div className="flex flex-1 items-center gap-2 overflow-x-auto">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex flex-none items-center gap-1.5 rounded-full border border-border bg-background py-1 pl-2.5 pr-1.5 text-xs text-text-secondary"
                        >
                            <FileText size={12} className="text-docs-blue-600" />
                            <span className="max-w-[9rem] truncate">{doc.name}</span>
                            <button
                                type="button"
                                onClick={() => removeDocument(doc.id)}
                                className="rounded-full p-0.5 text-text-muted hover:bg-surface hover:text-danger"
                            >
                                <X size={11} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={authLoading || uploading}
                        className="flex flex-none items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-brand-400 hover:text-brand-600"
                    >
                        <Plus size={12} />
                        {uploading ? "Uploading..." : "Add"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFilesPicked}
                    />
                </div>

                <button
                    type="button"
                    onClick={startNewChat}
                    className="flex flex-none items-center gap-1.5 rounded-docs-md border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background"
                >
                    <Plus size={14} />
                    New chat
                </button>
            </div>

            {/* messages */}
            <div className="relative min-h-0 flex-1">
                <div ref={scrollRef} className="h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    {messages.length === 0 ? (
                        <div className="mx-auto mt-16 max-w-sm text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-docs-lg bg-brand-50 text-brand-600">
                                <MessageSquare size={22} />
                            </div>
                            <h2 className="mb-1 text-sm font-semibold">Ask your documents anything</h2>
                            <p className="text-sm text-text-secondary">
                                Answers are grounded only in the documents you&apos;ve added above.
                            </p>
                        </div>
                    ) : (
                        <div className="mx-auto flex max-w-3xl flex-col gap-8">
                            {messages.map((message) =>
                                message.role === "user" ? (
                                    <div key={message.id} className="flex justify-end">
                                        <div className="max-w-[85%] rounded-docs-lg bg-brand-600 px-4 py-2.5 text-sm text-white">
                                            {message.content}
                                        </div>
                                    </div>
                                ) : (
                                    <div key={message.id} className="flex gap-3">
                                        <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-white">
                                            <Sparkles size={13} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm leading-relaxed">{message.content}</p>

                                            {message.sources && message.sources.length > 0 && (
                                                <div className="mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSources(message.id)}
                                                        className="text-xs font-medium text-docs-blue-600 hover:text-docs-blue-700"
                                                    >
                                                        {message.sourcesOpen
                                                            ? "Hide sources"
                                                            : `View sources (${message.sources.length})`}
                                                    </button>
                                                    {message.sourcesOpen && (
                                                        <ul className="mt-2 space-y-1">
                                                            {message.sources.map((source) => (
                                                                <li
                                                                    key={source}
                                                                    className="rounded-docs-sm bg-docs-blue-50 px-2.5 py-1 text-xs text-docs-blue-700"
                                                                >
                                                                    {source}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-1.5 flex items-center gap-0.5 text-text-muted">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(message.content)}
                                                    className="rounded-docs-sm p-1.5 hover:bg-surface hover:text-text-primary"
                                                    title="Copy"
                                                >
                                                    <Copy size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRegenerate(message.id)}
                                                    className="rounded-docs-sm p-1.5 hover:bg-surface hover:text-text-primary"
                                                    title="Regenerate"
                                                >
                                                    <RefreshCw size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFeedback(message.id, "up")}
                                                    className={`rounded-docs-sm p-1.5 hover:bg-surface ${
                                                        message.feedback === "up" ? "text-success" : "hover:text-text-primary"
                                                    }`}
                                                    title="Good response"
                                                >
                                                    <ThumbsUp size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFeedback(message.id, "down")}
                                                    className={`rounded-docs-sm p-1.5 hover:bg-surface ${
                                                        message.feedback === "down" ? "text-danger" : "hover:text-text-primary"
                                                    }`}
                                                    title="Poor response"
                                                >
                                                    <ThumbsDown size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}

                            {isSending && (
                                <div className="flex gap-3">
                                    <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-white">
                                        <Sparkles size={13} />
                                    </div>
                                    <div className="flex items-center gap-1.5 py-1.5">
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* fade so text doesn't look like it's cut off behind the input */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent" />
            </div>

            {/* input — stays put because the column above it has a bounded height */}
            <form onSubmit={handleSubmit} className="flex-none border-t border-border bg-surface px-4 py-3 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-docs-lg border border-border bg-background px-3 py-2 focus-within:border-brand-400">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex-none rounded-docs-sm p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                        title="Attach"
                    >
                        <Paperclip size={17} />
                    </button>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                runQuery(input);
                            }
                        }}
                        rows={1}
                        placeholder={
                            documents.length > 0
                                ? "Ask a follow-up question..."
                                : "Add a document above to start asking questions"
                        }
                        disabled={authLoading || documentsLoading || documents.length === 0 || isSending}
                        className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isSending || documents.length === 0}
                        className="flex-none rounded-docs-md bg-brand-600 p-2 text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}