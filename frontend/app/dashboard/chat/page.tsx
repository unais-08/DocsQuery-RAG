"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";

import { ChatComposer } from "@/components/dashboard/chat/chat-composer";
import { ChatDocumentToolbar } from "@/components/dashboard/chat/chat-document-toolbar";
import { ChatMessages } from "@/components/dashboard/chat/chat-messages";
import type { ChatMessage, DocSource, Feedback } from "@/components/dashboard/chat/chat-types";
import { useAuth } from "@/context/auth-context";
import {
    getDocuments,
    uploadDocument,
    validateDocumentFile,
    type Document,
} from "@/lib/api/documents";
import { queryDocuments } from "@/lib/api/query";

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

const CHAT_HEIGHT_CLASS = "h-[calc(100dvh-4rem)]";

export default function DocsChatPage() {
    const { token, loading: authLoading } = useAuth();

    // State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [documents, setDocuments] = useState<DocSource[]>([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Data fetching and textarea behavior
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

    useEffect(() => {
        const element = textareaRef.current;
        if (!element) return;
        element.style.height = "auto";
        element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
    }, [input]);

    // Event handlers
    async function runQuery(query: string) {
        if (!query.trim() || documents.length === 0 || !token || isSending) return;

        const question = query.trim();
        const userMessage: ChatMessage = { id: nextId(), role: "user", content: question };
        setMessages((previous) => [...previous, userMessage]);
        setInput("");
        setIsSending(true);

        try {
            const result = await queryDocuments({ question }, token);
            setMessages((previous) => [
                ...previous,
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

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        void runQuery(input);
    }

    function handleRegenerate(assistantId: number) {
        const index = messages.findIndex((message) => message.id === assistantId);
        const lastUser = [...messages.slice(0, index)].reverse().find((message) => message.role === "user");
        if (!lastUser) return;
        setMessages((previous) => previous.filter((message) => message.id !== assistantId));
        void runQuery(lastUser.content);
    }

    function handleCopy(content: string) {
        navigator.clipboard?.writeText(content).catch(() => { });
    }

    function toggleSources(id: number) {
        setMessages((previous) =>
            previous.map((message) =>
                message.id === id ? { ...message, sourcesOpen: !message.sourcesOpen } : message,
            ),
        );
    }

    function setFeedback(id: number, value: Feedback) {
        setMessages((previous) =>
            previous.map((message) =>
                message.id === id
                    ? { ...message, feedback: message.feedback === value ? null : value }
                    : message,
            ),
        );
    }

    function removeDocument(id: string) {
        setDocuments((previous) => previous.filter((document) => document.id !== id));
    }

    async function handleFilesPicked(event: ChangeEvent<HTMLInputElement>) {
        const file = Array.from(event.target.files ?? [])[0];
        event.target.value = "";
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
            setDocuments((previous) => [toDocSource(response.document), ...previous]);
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
        <div className={`-my-4 sm:-my-6 lg:-my-8 flex ${CHAT_HEIGHT_CLASS} flex-col bg-background text-text-primary`}>
            <ChatDocumentToolbar
                documents={documents}
                authLoading={authLoading}
                uploading={uploading}
                fileInputRef={fileInputRef}
                onRemoveDocument={removeDocument}
                onFilesPicked={handleFilesPicked}
                onNewChat={startNewChat}
            />

            <ChatMessages
                messages={messages}
                isSending={isSending}
                scrollRef={scrollRef}
                onRegenerate={handleRegenerate}
                onCopy={handleCopy}
                onToggleSources={toggleSources}
                onFeedback={setFeedback}
            />

            <ChatComposer
                input={input}
                authLoading={authLoading}
                documentsLoading={documentsLoading}
                hasDocuments={documents.length > 0}
                isSending={isSending}
                uploading={uploading}
                textareaRef={textareaRef}
                onInputChange={(event) => setInput(event.target.value)}
                onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void runQuery(input);
                    }
                }}
                onSubmit={handleSubmit}
                onAttach={() => fileInputRef.current?.click()}
            />
        </div>
    );
}
