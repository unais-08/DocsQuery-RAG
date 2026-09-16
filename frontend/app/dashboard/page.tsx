"use client";

import {
    FileText,
    HardDrive,
    Loader2,
    MessageCircle,
    Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { StatCard } from "@/components/dashboard/stats-card";
import { useAuth } from "@/context/auth-context";
import {
    uploadDocument,
    validateDocumentFile,
} from "@/lib/api/documents";

const recentDocuments = [
    {
        name: "Project Documentation.pdf",
        type: "PDF",
        size: "2.4 MB",
        status: "Ready",
        uploaded: "2 hours ago",
    },
    {
        name: "Resume.pdf",
        type: "PDF",
        size: "1.1 MB",
        status: "Ready",
        uploaded: "Yesterday",
    },
    {
        name: "Notes.txt",
        type: "TXT",
        size: "12 KB",
        status: "Processing",
        uploaded: "2 days ago",
    },
];

export default function DashboardPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token, user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const displayName = user?.name?.split(" ")[0] ?? "there";

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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
        const uploadToast = toast.loading("Uploading document...");
        try {
            await uploadDocument(file, token);
            toast.success("Document uploaded successfully", { id: uploadToast });
        } catch {
            toast.error("Failed to upload document", { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                        Welcome back, {displayName} 👋
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Here&apos;s what&apos;s happening with your documents.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {uploading ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
                        {uploading ? "Uploading..." : "Upload document"}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={(event) => void handleUpload(event)}
                    />
                </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Documents"
                    value="12"
                    description="Uploaded documents"
                    icon={<FileText size={20} />}
                />

                <StatCard
                    title="Questions asked"
                    value="87"
                    description="Total questions"
                    icon={<MessageCircle size={20} />}
                />

                <StatCard
                    title="Storage used"
                    value="24 MB"
                    description="Of 100 MB available"
                    icon={<HardDrive size={20} />}
                />
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-docs-card">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="font-semibold text-gray-950">
                            Recent documents
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-400">
                            Your recently uploaded files
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                        View all
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentDocuments.map((document) => (
                        <div
                            key={document.name}
                            className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-red-600">
                                    <FileText size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                        {document.name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-400">
                                        {document.type} · {document.size} · {document.uploaded}
                                    </p>
                                </div>
                            </div>

                            <StatusBadge status={document.status} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const ready = status === "Ready";

    return (
        <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                ready ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
            }`}
        >
            {status}
        </span>
    );
}