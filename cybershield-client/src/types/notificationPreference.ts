export interface NotificationPreference {
  emailEnabled: boolean;
  websiteOffline: boolean;
  invalidSsl: boolean;
  httpsDisabled: boolean;
  sslExpiringSoon: boolean;
  sslExpired: boolean;
  slowResponse: boolean;
  securityScoreDropped: boolean;
}