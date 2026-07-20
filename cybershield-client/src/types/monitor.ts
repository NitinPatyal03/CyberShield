export interface MonitoredWebsite {
    id: number;
    url: string;
    isActive: boolean;
    createdAt: string;
    lastScanAt: string | null;
}

export interface MonitorHistory {
    id: number;
    scanDate: string;
    securityScore: number;
    grade: string;
    statusCode: number;
    responseTime: number;
    isHttps: boolean;
    isCertificateValid: boolean;
}