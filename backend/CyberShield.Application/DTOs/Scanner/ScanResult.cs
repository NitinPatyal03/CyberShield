using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs.Scanner;

public class ScanResult
{
    public string Url { get; set; } = string.Empty;

    public bool IsOnline { get; set; }

    public bool IsHttps { get; set; }

    public int StatusCode { get; set; }

    public long ResponseTime { get; set; }

    public bool HasHsts { get; set; }

    public bool HasCsp { get; set; }

    public bool HasXFrameOptions { get; set; }

    public int SecurityScore { get; set; }

    public bool HasXContentTypeOptions { get; set; }

    public bool HasReferrerPolicy { get; set; }

    public bool HasPermissionsPolicy { get; set; }

    public bool UsesSecureCookies { get; set; }

    public bool UsesHttpOnlyCookies { get; set; }

    public bool IsCertificateValid { get; set; }

    public bool RedirectsToHttps { get; set; }

    public string ServerHeader { get; set; } = string.Empty;

    public List<SecurityRecommendation> Recommendations { get; set; }
    = new();

    public string Grade { get; set; } = "F";

    public string CertificateIssuer { get; set; } = string.Empty;

    public string CertificateSubject { get; set; } = string.Empty;

    public DateTime? CertificateExpiryDate { get; set; }

    public int DaysUntilExpiry { get; set; }

    public bool IsCertificateExpired { get; set; }

    public List<PortResult> OpenPorts { get; set; } = new();
    public List<Vulnerability> Vulnerabilities { get; set; } = new();
}
