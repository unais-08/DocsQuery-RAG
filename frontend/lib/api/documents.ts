import { apiRequest } from "@/lib/api/client";

const DOCUMENTS_API_PREFIX = "/api/v1/documents";

export type Document = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

type DocumentsResponse = {
  documents: Document[];
  count: number;
};

type DocumentResponse = {
  document: Document;
};

export function getDocuments(token: string) {
  return apiRequest<DocumentsResponse>(DOCUMENTS_API_PREFIX, {}, token);
}

export function getDocument(id: string, token: string) {
  return apiRequest<DocumentResponse>(`${DOCUMENTS_API_PREFIX}/${id}`, {}, token);
}

export function uploadDocument(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<DocumentResponse>(
    DOCUMENTS_API_PREFIX,
    { method: "POST", body: formData },
    token,
  );
}

export function renameDocument(id: string, name: string, token: string) {
  return apiRequest<DocumentResponse>(
    `${DOCUMENTS_API_PREFIX}/${id}`,
    { method: "PATCH", body: JSON.stringify({ name }) },
    token,
  );
}

export function deleteDocument(id: string, token: string) {
  return apiRequest<void>(
    `${DOCUMENTS_API_PREFIX}/${id}`,
    { method: "DELETE" },
    token,
  );
}
