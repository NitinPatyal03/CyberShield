import api from "../api/axios";

export interface ScanRequest {
  url: string;
}

export interface SecurityRecommendation {
  title: string;
  description: string;
  severity: string;
}

export interface Vulnerability {
  name: string;
  severity: string;
  description: string;
  recommendation: string;
}

export interface PortResult {
  port: number;
  service: string;
  isOpen: boolean;
}

export interface SSLInfo {
  issuer: string;
  validFrom: string;
  validTo: string;
}

export interface SecurityHeader {
  name: string;
  present: boolean;
  description: string;
}

export interface ScanResult {
  url: string;
  isOnline: boolean;
  isHttps: boolean;
  statusCode: number;
  responseTime: number;
  securityScore: number;
  grade: string;

  hasHsts: boolean;
  hasCsp: boolean;
  hasXFrameOptions: boolean;
  hasXContentTypeOptions: boolean;
  hasReferrerPolicy: boolean;
  hasPermissionsPolicy: boolean;

  serverHeader: string;

  recommendations: SecurityRecommendation[];
  vulnerabilities: Vulnerability[];
  openPorts: PortResult[];

  certificateIssuer: string;
  certificateSubject: string;
  certificateExpiryDate: string | null;
  daysUntilExpiry: number;
  isCertificateValid: boolean;
}

export const scanWebsite = async (url: string) => {
  const response = await api.post<ScanResult>("/api/Scanner/scan", {
    url,
  });

  return response.data;
};