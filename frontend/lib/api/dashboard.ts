import { apiRequest } from "@/lib/api/client";

const DASHBOARD_API_PREFIX = "/api/v1/dashboard";

export type DashboardStats = {
  documents: number;
  questions: number;
  storageBytes: number;
};

export function getDashboardStats(token: string) {
  return apiRequest<DashboardStats>(`${DASHBOARD_API_PREFIX}/stats`, {}, token);
}