"use client";

import { useMemo, useRef, useState } from "react";
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

type DocumentType = "PDF" | "DOCX";
type DocumentStatus = "Ready" | "Processing" | "Failed";

type DocumentItem = {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  status: DocumentStatus;
  createdAt: string;
};

const mockDocuments: DocumentItem[] = [
  {
    id: "1",
    name: "System Design.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "Ready",
    createdAt: "Sep 16, 2026",
  },
  {
    id: "2",
    name: "Backend Notes.docx",
    type: "DOCX",
    size: "1.1 MB",
    status: "Ready",
    createdAt: "Sep 15, 2026",
  },
  {
    id: "3",
    name: "Database Documentation.pdf",
    type: "PDF",
    size: "3.2 MB",
    status: "Processing",
    createdAt: "Sep 14, 2026",
  },
];

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState(mockDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const filteredDocuments = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((doc) => doc.name.toLowerCase().includes(q));
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

    setUploading(true);

    // TODO:
    // Connect this to:
    // POST /api/documents
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newDocument: DocumentItem = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "Processing",
      createdAt: "Just now",
    };

    setDocuments((prev) => [newDocument, ...prev]);
    setUploading(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDelete = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    if (!window.confirm(`Delete "${doc.name}"? This can't be undone.`)) return;

    setDocuments((prev) => prev.filter((d) => d.id !== id));

    // TODO:
    // DELETE /api/documents/:id
  };

  const startRename = (doc: DocumentItem) => {
    setRenamingId(doc.id);
    setDraftName(doc.name);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setDraftName("");
  };

  const confirmRename = (id: string) => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      cancelRename();
      return;
    }

    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, name: trimmed } : doc))
    );

    // TODO:
    // PATCH /api/documents/:id

    cancelRename();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Documents
          </h1>
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
          Upload document
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {/* Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-docs-lg border-2 border-dashed px-6 py-8 text-center transition ${isDragging
          ? "border-brand-500 bg-brand-50"
          : "border-border bg-surface hover:border-brand-300 hover:bg-brand-50/40"
          }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-text-primary">
            {uploading
              ? "Uploading document…"
              : "Drag and drop a file, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            PDF or DOCX · Up to 10MB
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-docs-md border border-danger/20 bg-red-50 px-4 py-2.5 text-sm text-danger">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="rounded p-1 hover:bg-red-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-text-primary">
          {documents.length} {documents.length === 1 ? "document" : "documents"}
        </h2>

        {documents.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
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

      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-docs-lg border border-border bg-surface px-6 py-14 text-center shadow-docs-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Inbox size={22} />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">No documents yet</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Upload a file to start asking questions about it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 rounded-docs-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
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
            <div
              key={document.id}
              className={`flex items-center gap-4 px-5 py-4 transition hover:bg-background ${index !== filteredDocuments.length - 1
                ? "border-b border-border"
                : ""
                }`}
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-docs-md ${document.type === "PDF"
                  ? "bg-red-50 text-red-600"
                  : "bg-docs-blue-50 text-docs-blue-600"
                  }`}
              >
                <FileText size={18} />
              </div>

              {/* Info / rename */}
              <div className="min-w-0 flex-1">
                {renamingId === document.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") confirmRename(document.id);
                        if (event.key === "Escape") cancelRename();
                      }}
                      className="h-8 w-full max-w-xs rounded-md border border-brand-300 bg-surface px-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <button
                      type="button"
                      onClick={() => confirmRename(document.id)}
                      className="rounded p-1.5 text-brand-600 hover:bg-brand-50"
                      title="Save"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelRename}
                      className="rounded p-1.5 text-text-muted hover:bg-background"
                      title="Cancel"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-text-primary">
                      {document.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      <span>{document.type}</span>
                      <span>·</span>
                      <span>{document.size}</span>
                      <span>·</span>
                      <span>{document.createdAt}</span>
                    </div>
                  </>
                )}
              </div>

              {renamingId !== document.id && (
                <>
                  <StatusBadge status={document.status} />

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Open"
                      onClick={() => {
                        // TODO:
                        // GET /api/documents/:id
                      }}
                      className="hidden rounded-md p-2 text-text-secondary hover:bg-background hover:text-text-primary sm:inline-flex"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      type="button"
                      title="Rename"
                      onClick={() => startRename(document)}
                      className="rounded-md p-2 text-text-secondary hover:bg-background hover:text-text-primary"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => handleDelete(document.id)}
                      className="rounded-md p-2 text-text-secondary hover:bg-red-50 hover:text-danger"
                    >
                      <Trash2 size={16} />
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

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}