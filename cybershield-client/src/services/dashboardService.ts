import api from "../api/axios";

export interface RecentScan {
  id: number;
  url: string;
  score: number;
  grade: string;
  scanDate: string;
}

export interface DashboardData {
  totalScans: number;
  averageScore: number;
  bestGrade: string;
  totalHighRisk: number;
  recentScans: RecentScan[];
}

export async function getDashboard() {
  const response = await api.get<DashboardData>("/Dashboard");
  return response.data;
}