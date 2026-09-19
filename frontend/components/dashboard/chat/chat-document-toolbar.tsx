"use client";

import { Check, FileText, Plus } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

import type { DocSource } from "./chat-types";

type ChatDocumentToolbarProps = {
    documents: DocSource[];
    selectedDocumentIds: string[];
    authLoading: boolean;
    uploading: boolean;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onToggleDocument: (id: string) => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onFilesPicked: (event: ChangeEvent<HTMLInputElement>) => void;
    onNewChat: () => void;
};

export function ChatDocumentToolbar({
    documents,
    selectedDocumentIds,
    authLoading,
    uploading,
    fileInputRef,
    onToggleDocument,
    onSelectAll,
    onClearSelection,
    onFilesPicked,
    onNewChat,
}: ChatDocumentToolbarProps) {
    return (
        <div className="flex flex-none items-center gap-3 border-b border-border bg-surface px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
                <span className="flex-none text-xs font-medium text-text-secondary">Documents</span>
                {documents.map((document) => (
                    <button
                        key={document.id}
                        type="button"
                        onClick={() => onToggleDocument(document.id)}
                        className="flex flex-none items-center gap-1.5 rounded-full border border-border bg-background py-1 pl-2.5 pr-1.5 text-xs text-text-secondary"
                    >
                        <FileText size={12} className="text-docs-blue-600" />
                        <span className="max-w-[9rem] truncate">{document.name}</span>
                        {selectedDocumentIds.includes(document.id) && <Check size={12} className="text-brand-600" />}
                    </button>
                ))}

                {documents.length > 0 && (
                    <>
                        <button type="button" onClick={onSelectAll} className="flex-none text-xs font-medium text-brand-600 hover:text-brand-700">
                            Select all
                        </button>
                        <button type="button" onClick={onClearSelection} className="flex-none text-xs text-text-muted hover:text-text-primary">
                            Clear
                        </button>
                        <span className="flex-none text-xs text-text-muted">
                            {selectedDocumentIds.length} selected
                        </span>
                    </>
                )}

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
