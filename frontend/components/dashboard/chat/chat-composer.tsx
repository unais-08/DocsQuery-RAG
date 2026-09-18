"use client";

import { Paperclip, Send } from "lucide-react";
import type { ChangeEvent, FormEvent, KeyboardEvent, RefObject } from "react";

 type ChatComposerProps = {
    input: string;
    authLoading: boolean;
    documentsLoading: boolean;
    hasDocuments: boolean;
    isSending: boolean;
    uploading: boolean;
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    onInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onAttach: () => void;
};

export function ChatComposer({
    input,
    authLoading,
    documentsLoading,
    hasDocuments,
    isSending,
    uploading,
    textareaRef,
    onInputChange,
    onKeyDown,
    onSubmit,
    onAttach,
}: ChatComposerProps) {
    return (
        <form onSubmit={onSubmit} className="flex-none border-t border-border bg-surface px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-docs-lg border border-border bg-background px-3 py-2 focus-within:border-brand-400">
                <button
                    type="button"
                    onClick={onAttach}
                    disabled={uploading}
                    className="flex-none rounded-docs-sm p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                    title="Attach"
                >
                    <Paperclip size={17} />
                </button>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder={
                        hasDocuments
                            ? "Ask a follow-up question..."
                            : "Add a document above to start asking questions"
                    }
                    disabled={authLoading || documentsLoading || !hasDocuments || isSending}
                    className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isSending || !hasDocuments}
                    className="flex-none rounded-docs-md bg-brand-600 p-2 text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
                >
                    <Send size={16} />
                </button>
            </div>
        </form>
    );
}
