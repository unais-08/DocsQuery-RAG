"use client";

import { Check, ChevronDown, FileText, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const filteredDocuments = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return documents;
        return documents.filter((document) => document.name.toLowerCase().includes(query));
    }, [documents, search]);

    const selectedDocuments = useMemo(
        () => documents.filter((document) => selectedDocumentIds.includes(document.id)),
        [documents, selectedDocumentIds],
    );
    const allSelected = documents.length > 0 && selectedDocumentIds.length === documents.length;

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                panelRef.current?.contains(event.target as Node) ||
                triggerRef.current?.contains(event.target as Node)
            ) {
                return;
            }
            setIsOpen(false);
        }
        function handleEscape(event: globalThis.KeyboardEvent) {
            if (event.key === "Escape") setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) setSearch("");
    }, [isOpen]);

    return (
        <div className="flex flex-none items-center gap-3 border-b border-border bg-surface px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="relative min-w-0 flex-1">
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setIsOpen((previous) => !previous)}
                    disabled={authLoading || documents.length === 0}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className="flex items-center gap-2 rounded-docs-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FileText size={14} className="text-docs-blue-600" />
                    <span>
                        {documents.length === 0
                            ? "No documents"
                            : selectedDocumentIds.length === 0
                                ? "Select documents"
                                : `${selectedDocumentIds.length} of ${documents.length} selected`}
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {!isOpen && selectedDocuments.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {selectedDocuments.slice(0, 3).map((document) => (
                            <span
                                key={document.id}
                                className="flex items-center gap-1 rounded-full bg-brand-600/10 px-2 py-0.5 text-[11px] text-brand-700"
                            >
                                <span className="max-w-[8rem] truncate">{document.name}</span>
                                <button
                                    type="button"
                                    onClick={() => onToggleDocument(document.id)}
                                    className="text-brand-500 hover:text-brand-700"
                                    aria-label={`Remove ${document.name}`}
                                >
                                    <X size={10} />
                                </button>
                            </span>
                        ))}
                        {selectedDocuments.length > 3 && (
                            <span className="text-[11px] text-text-muted">
                                +{selectedDocuments.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {isOpen && (
                    <div
                        ref={panelRef}
                        role="listbox"
                        aria-multiselectable="true"
                        className="absolute left-0 top-full z-20 mt-2 w-80 max-w-[90vw] rounded-docs-md border border-border bg-background shadow-lg"
                    >
                        <div className="border-b border-border p-2">
                            <div className="flex items-center gap-2 rounded-docs-md border border-border bg-surface px-2.5 py-1.5">
                                <Search size={13} className="text-text-muted" />
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search documents"
                                    className="w-full bg-transparent text-xs text-text-primary outline-none placeholder:text-text-muted"
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto p-1">
                            {filteredDocuments.length === 0 ? (
                                <p className="px-3 py-6 text-center text-xs text-text-muted">
                                    {documents.length === 0 ? "No documents uploaded yet." : "No matches."}
                                </p>
                            ) : (
                                filteredDocuments.map((document) => {
                                    const selected = selectedDocumentIds.includes(document.id);
                                    return (
                                        <button
                                            key={document.id}
                                            type="button"
                                            role="option"
                                            aria-selected={selected}
                                            onClick={() => onToggleDocument(document.id)}
                                            className={`flex w-full items-center gap-2.5 rounded-docs-md px-2.5 py-2 text-left text-xs transition-colors ${selected ? "bg-brand-600/10" : "hover:bg-surface"
                                                }`}
                                        >
                                            <span
                                                className={`flex h-4 w-4 flex-none items-center justify-center rounded border ${selected
                                                        ? "border-brand-600 bg-brand-600 text-white"
                                                        : "border-border bg-background"
                                                    }`}
                                            >
                                                {selected && <Check size={11} />}
                                            </span>
                                            <FileText size={13} className="flex-none text-docs-blue-600" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-text-primary">{document.name}</span>
                                                <span className="block text-[10px] text-text-muted">{document.size}</span>
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {documents.length > 0 && (
                            <div className="flex items-center justify-between border-t border-border px-3 py-2">
                                <button
                                    type="button"
                                    onClick={allSelected ? onClearSelection : onSelectAll}
                                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                                >
                                    {allSelected ? "Clear all" : "Select all"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={authLoading || uploading}
                                    className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-brand-600"
                                >
                                    <Plus size={12} />
                                    {uploading ? "Uploading..." : "Add document"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFilesPicked} />
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