"use client";

import { Copy, MessageSquare, RefreshCw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import type { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ChatMessage, Feedback } from "./chat-types";

type ChatMessagesProps = {
    messages: ChatMessage[];
    isSending: boolean;
    scrollRef: RefObject<HTMLDivElement | null>;
    onRegenerate: (id: string) => void;
    onCopy: (content: string) => void;
    onToggleSources: (id: string) => void;
    onFeedback: (id: string, value: Feedback) => void;
};

const markdownClasses =
    "text-sm leading-relaxed text-text-primary [&_a]:text-docs-blue-600 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-docs-sm [&_pre]:bg-background [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5";

export function ChatMessages({
    messages,
    isSending,
    scrollRef,
    onRegenerate,
    onCopy,
    onToggleSources,
    onFeedback,
}: ChatMessagesProps) {
    return (
        <div className="relative min-h-0 flex-1">
            <div ref={scrollRef} className="h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                {messages.length === 0 ? (
                    <EmptyChatState />
                ) : (
                    <div className="mx-auto flex max-w-3xl flex-col gap-8">
                        {messages.map((message) => (
                            <ChatMessageItem
                                key={message.id}
                                message={message}
                                onRegenerate={onRegenerate}
                                onCopy={onCopy}
                                onToggleSources={onToggleSources}
                                onFeedback={onFeedback}
                            />
                        ))}
                        {isSending && <TypingIndicator />}
                    </div>
                )}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent" />
        </div>
    );
}

type ChatMessageItemProps = Omit<ChatMessagesProps, "messages" | "isSending" | "scrollRef"> & {
    message: ChatMessage;
};

function ChatMessageItem({
    message,
    onRegenerate,
    onCopy,
    onToggleSources,
    onFeedback,
}: ChatMessageItemProps) {
    if (message.role === "user") {
        return (
            <div className="flex justify-end">
                <div className="max-w-[85%] rounded-docs-lg bg-brand-600 px-4 py-2.5 text-sm text-white">
                    {message.content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3">
            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-white">
                <Sparkles size={13} />
            </div>
            <div className="min-w-0 flex-1">
                <div className={markdownClasses}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                </div>

                {message.sources && message.sources.length > 0 && (
                    <MessageSources
                        sources={message.sources}
                        isOpen={message.sourcesOpen ?? false}
                        onToggle={() => onToggleSources(message.id)}
                    />
                )}

                <MessageActions
                    feedback={message.feedback ?? null}
                    onCopy={() => onCopy(message.content)}
                    onRegenerate={() => onRegenerate(message.id)}
                    onFeedback={(value) => onFeedback(message.id, value)}
                />
            </div>
        </div>
    );
}

function MessageSources({
    sources,
    isOpen,
    onToggle,
}: {
    sources: NonNullable<ChatMessage["sources"]>;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="mt-2">
            <button
                type="button"
                onClick={onToggle}
                className="text-xs font-medium text-docs-blue-600 hover:text-docs-blue-700"
            >
                {isOpen ? "Hide sources" : `View sources (${sources.length})`}
            </button>
            {isOpen && (
                <ul className="mt-2 space-y-1">
                    {sources.map((source,idx) => (
                        <li 
                            key={source.chunkId + idx}
                            className="rounded-docs-sm bg-docs-blue-50 px-2.5 py-1 text-xs text-docs-blue-700"
                        >
                            {source.documentName}{source.pageNumber ? `, p. ${source.pageNumber}` : ""}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function MessageActions({
    feedback,
    onCopy,
    onRegenerate,
    onFeedback,
}: {
    feedback: Feedback;
    onCopy: () => void;
    onRegenerate: () => void;
    onFeedback: (value: Feedback) => void;
}) {
    return (
        <div className="mt-1.5 flex items-center gap-0.5 text-text-muted">
            <button type="button" onClick={onCopy} className="rounded-docs-sm p-1.5 hover:bg-surface hover:text-text-primary" title="Copy">
                <Copy size={13} />
            </button>
            <button type="button" onClick={onRegenerate} className="rounded-docs-sm p-1.5 hover:bg-surface hover:text-text-primary" title="Regenerate">
                <RefreshCw size={13} />
            </button>
            <button
                type="button"
                onClick={() => onFeedback("up")}
                className={`rounded-docs-sm p-1.5 hover:bg-surface ${feedback === "up" ? "text-success" : "hover:text-text-primary"}`}
                title="Good response"
            >
                <ThumbsUp size={13} />
            </button>
            <button
                type="button"
                onClick={() => onFeedback("down")}
                className={`rounded-docs-sm p-1.5 hover:bg-surface ${feedback === "down" ? "text-danger" : "hover:text-text-primary"}`}
                title="Poor response"
            >
                <ThumbsDown size={13} />
            </button>
        </div>
    );
}

function EmptyChatState() {
    return (
        <div className="mx-auto mt-16 max-w-sm text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-docs-lg bg-brand-50 text-brand-600">
                <MessageSquare size={22} />
            </div>
            <h2 className="mb-1 text-sm font-semibold">Ask your documents anything</h2>
            <p className="text-sm text-text-secondary">
                Answers are grounded only in the documents you&apos;ve added above.
            </p>
        </div>
    );
}

function TypingIndicator() {
    return (
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
    );
}
