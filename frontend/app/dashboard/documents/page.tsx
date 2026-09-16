"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  Check,
  ExternalLink,
  FileText,
  Inbox,
  Loader2,
  Pencil,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  deleteDocument,
  getDocument,
  getDocuments,
  renameDocument,
  uploadDocument,
  type Document,
} from "@/lib/api/documents";

type DocumentStatus = "Ready" | "Processing" | "Failed";
type DocumentItem = Document & { sizeLabel: string; status: DocumentStatus };

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function toDocumentItem(document: Document): DocumentItem {
  return {
    ...document,
    sizeLabel: `${(document.size / (1024 * 1024)).toFixed(1)} MB`,
    status: "Ready",
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function documentType(type: string) {
  return type.includes("pdf") ? "PDF" : "DOCX";
}

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [savingRename, setSavingRename] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    void getDocuments(token)
      .then((response) => {
        if (!cancelled) setDocuments(response.documents.map(toDocumentItem));
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(getErrorMessage(requestError, "Failed to load documents."));
      })
      .finally(() => {
        if (!cancelled) setDocumentsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return documents;
    return documents.filter((document) =>
      document.name.toLowerCase().includes(normalizedQuery),
    );
  }, [documents, query]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB.");
      return;
    }
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadDocument(file, token);
      setDocuments((previous) => [toDocumentItem(response.document), ...previous]);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to upload this document."));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void handleFiles(event.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    const document = documents.find((item) => item.id === id);
    if (!document || !window.confirm(`Delete "${document.name}"? This can't be undone.`)) return;
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setError(null);
    setDeletingId(id);
    try {
      await deleteDocument(id, token);
      setDocuments((previous) => previous.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to delete this document."));
    } finally {
      setDeletingId(null);
    }
  };

  const startRename = (document: DocumentItem) => {
    setRenamingId(document.id);
    setDraftName(document.name);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setDraftName("");
  };

  const confirmRename = async (id: string) => {
    const name = draftName.trim();
    if (!name) {
      setError("Document name cannot be empty.");
      return;
    }
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setError(null);
    setSavingRename(true);
    try {
      const response = await renameDocument(id, name, token);
      setDocuments((previous) =>
        previous.map((item) =>
          item.id === id ? toDocumentItem(response.document) : item,
        ),
      );
      cancelRename();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to rename this document."));
    } finally {
      setSavingRename(false);
    }
  };

  const handleOpen = async (id: string) => {
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }
    try {
      await getDocument(id, token);
      setError("This document is stored securely, but file preview is not available yet.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to open this document."));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Documents</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Upload the files you want to ask questions about.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-docs-md bg-brand-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload document"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-docs-lg border-2 border-dashed px-6 py-8 text-center transition ${
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-border bg-surface hover:border-brand-300 hover:bg-brand-50/40"
        }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {uploading ? "Uploading document..." : "Drag and drop a file, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-text-muted">PDF or DOCX · Up to 10MB</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-docs-md border border-danger/20 bg-red-50 px-4 py-2.5 text-sm text-danger">
          {error}
          <button type="button" onClick={() => setError(null)} className="rounded p-1 hover:bg-red-100">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-text-primary">
          {documents.length} {documents.length === 1 ? "document" : "documents"}
        </h2>
        {documents.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search documents"
              className="h-9 w-full rounded-docs-md border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        )}
      </div>

      {authLoading || (token ? documentsLoading : false) ? (
        <div className="rounded-docs-lg border border-border bg-surface px-6 py-10 text-center text-sm text-text-secondary shadow-docs-card">
          Loading documents...
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-docs-lg border border-border bg-surface px-6 py-14 text-center shadow-docs-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Inbox size={22} />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">No documents yet</h3>
            <p className="mt-1 text-sm text-text-secondary">Upload a file to start asking questions about it.</p>
          </div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 rounded-docs-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Upload document
          </button>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="rounded-docs-lg border border-border bg-surface px-6 py-10 text-center text-sm text-text-secondary shadow-docs-card">
          No documents match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="overflow-hidden rounded-docs-lg border border-border bg-surface shadow-docs-card">
          {filteredDocuments.map((document, index) => (
            <div key={document.id} className={`flex items-center gap-4 px-5 py-4 transition hover:bg-background ${index !== filteredDocuments.length - 1 ? "border-b border-border" : ""}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-docs-md ${documentType(document.type) === "PDF" ? "bg-red-50 text-red-600" : "bg-docs-blue-50 text-docs-blue-600"}`}>
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                {renamingId === document.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") void confirmRename(document.id);
                        if (event.key === "Escape") cancelRename();
                      }}
                      className="h-8 w-full max-w-xs rounded-md border border-brand-300 bg-surface px-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <button type="button" onClick={() => void confirmRename(document.id)} disabled={savingRename} className="rounded p-1.5 text-brand-600 hover:bg-brand-50 disabled:opacity-50" title="Save">
                      <Check size={15} />
                    </button>
                    <button type="button" onClick={cancelRename} disabled={savingRename} className="rounded p-1.5 text-text-muted hover:bg-background" title="Cancel">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-text-primary">{document.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      <span>{documentType(document.type)}</span><span>·</span><span>{document.sizeLabel}</span><span>·</span><span>{formatDate(document.createdAt)}</span>
                    </div>
                  </>
                )}
              </div>
              {renamingId !== document.id && (
                <>
                  <StatusBadge status={document.status} />
                  <div className="flex items-center gap-1">
                    <button type="button" title="Open" onClick={() => void handleOpen(document.id)} className="hidden rounded-md p-2 text-text-secondary hover:bg-background hover:text-text-primary sm:inline-flex">
                      <ExternalLink size={16} />
                    </button>
                    <button type="button" title="Rename" onClick={() => startRename(document)} disabled={deletingId !== null} className="rounded-md p-2 text-text-secondary hover:bg-background hover:text-text-primary disabled:opacity-50">
                      <Pencil size={16} />
                    </button>
                    <button type="button" title="Delete" onClick={() => void handleDelete(document.id)} disabled={deletingId === document.id} className="rounded-md p-2 text-text-secondary hover:bg-red-50 hover:text-danger disabled:opacity-50">
                      {deletingId === document.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const styles: Record<DocumentStatus, string> = {
    Ready: "bg-green-50 text-green-700",
    Processing: "bg-docs-blue-50 text-docs-blue-700",
    Failed: "bg-red-50 text-danger",
  };

  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>;
}
