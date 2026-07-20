using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Domain.Entities;

public class Website
{
    public int Id { get; set; }

    public string Url { get; set; } = string.Empty;

    public bool IsOnline { get; set; }

    public bool IsHttps { get; set; }

    public int StatusCode { get; set; }

    public long ResponseTime { get; set; }

    public bool HasHsts { get; set; }

    public bool HasCsp { get; set; }

    public bool HasXFrameOptions { get; set; }

    public int SecurityScore { get; set; }

    public DateTime ScanDate { get; set; } = DateTime.UtcNow;

    // NEW
    public string ApplicationUserId { get; set; } = string.Empty;

    public ApplicationUser? User { get; set; }

    public bool HasXContentTypeOptions { get; set; }

    public bool HasReferrerPolicy { get; set; }

    public bool HasPermissionsPolicy { get; set; }

    public bool UsesSecureCookies { get; set; }

    public bool UsesHttpOnlyCookies { get; set; }

    public bool IsCertificateValid { get; set; }

    public bool RedirectsToHttps { get; set; }

    public string ServerHeader { get; set; } = string.Empty;

    public string Grade { get; set; } = "F";

    public string CertificateIssuer { get; set; } = string.Empty;

    public string CertificateSubject { get; set; } = string.Empty;

    public DateTime? CertificateExpiryDate { get; set; }

    public int DaysUntilExpiry { get; set; }

    public bool IsCertificateExpired { get; set; }
}