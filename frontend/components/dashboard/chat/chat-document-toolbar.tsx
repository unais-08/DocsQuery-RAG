"use client";

import { FileText, Plus, X } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

import type { DocSource } from "./chat-types";

type ChatDocumentToolbarProps = {
    documents: DocSource[];
    authLoading: boolean;
    uploading: boolean;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onRemoveDocument: (id: string) => void;
    onFilesPicked: (event: ChangeEvent<HTMLInputElement>) => void;
    onNewChat: () => void;
};

export function ChatDocumentToolbar({
    documents,
    authLoading,
    uploading,
    fileInputRef,
    onRemoveDocument,
    onFilesPicked,
    onNewChat,
}: ChatDocumentToolbarProps) {
    return (
        <div className="flex flex-none items-center gap-3 border-b border-border bg-surface px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="flex flex-none items-center gap-1.5 rounded-full border border-border bg-background py-1 pl-2.5 pr-1.5 text-xs text-text-secondary"
                    >
                        <FileText size={12} className="text-docs-blue-600" />
                        <span className="max-w-[9rem] truncate">{document.name}</span>
                        <button
                            type="button"
                            onClick={() => onRemoveDocument(document.id)}
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
                    onChange={onFilesPicked}
                />
            </div>

            <button
                type="button"
                onClick={onNewChat}
                className="flex flex-none items-center gap-1.5 rounded-docs-md border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background"
            >
                <Plus size={14} />
                New chat
            </button>
        </div>
    );
}
