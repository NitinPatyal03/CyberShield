import api from "../api/axios";

export interface ScanHistory {
  id: number;
  url: string;
  statusCode: number;
  responseTime: number;
  securityScore: number;
  grade: string;
  isHttps: boolean;
  isCertificateValid: boolean;
  scanDate: string;
}

export const getHistory = async (): Promise<ScanHistory[]> => {
  const response = await api.get("/scanner/history");
  return response.data;
};

export const deleteHistory = async (id: number) => {
  await api.delete(`/scanner/${id}`);
};