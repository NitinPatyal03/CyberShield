export interface SecurityAlert {
  id: number;
  website: string;
  title: string;
  description: string;
  severity: string;
  isRead: boolean;
  createdAt: string;
}