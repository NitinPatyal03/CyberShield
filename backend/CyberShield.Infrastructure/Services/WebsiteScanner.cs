using System.Diagnostics;
using CyberShield.Application.DTOs.Scanner;
using CyberShield.Application.Interfaces;

namespace CyberShield.Infrastructure.Services;

public class WebsiteScanner : IWebsiteScanner
{
    private readonly HttpClient _httpClient;
    private readonly SslCertificateService _sslService;
    private readonly PortScannerService _portScanner;

    public WebsiteScanner(
        HttpClient httpClient,
        SslCertificateService sslService,
        PortScannerService portScanner)
    {
        _httpClient = httpClient;
        _sslService = sslService;
        _portScanner = portScanner;
    }

    public async Task<ScanResult> ScanAsync(string url)
    {
        if (!url.StartsWith("http://") && !url.StartsWith("https://"))
        {
            url = "https://" + url;
        }

        var result = new ScanResult
        {
            Url = url
        };

        var stopwatch = Stopwatch.StartNew();

        try
        {
            var response = await _httpClient.GetAsync(url);

            stopwatch.Stop();

            result.IsOnline = true;
            result.IsHttps = response.RequestMessage?.RequestUri?.Scheme == "https";
            result.StatusCode = (int)response.StatusCode;
            result.ResponseTime = stopwatch.ElapsedMilliseconds;

            // ==========================
            // Security Headers
            // ==========================

            result.HasHsts =
                response.Headers.Contains("Strict-Transport-Security");

            result.HasCsp =
                response.Headers.Contains("Content-Security-Policy");

            result.HasXFrameOptions =
                response.Headers.Contains("X-Frame-Options");

            result.HasXContentTypeOptions =
                response.Headers.Contains("X-Content-Type-Options");

            result.HasReferrerPolicy =
                response.Headers.Contains("Referrer-Policy");

            result.HasPermissionsPolicy =
                response.Headers.Contains("Permissions-Policy");

            // ==========================
            // Server Header
            // ==========================

            result.ServerHeader =
                response.Headers.Server?.ToString() ?? "Hidden";

            // ==========================
            // HTTPS Redirect
            // ==========================

            result.RedirectsToHttps =
                response.RequestMessage?.RequestUri?.Scheme == "https";

            // ==========================
            // SSL Certificate
            // ==========================

            result.IsCertificateValid = result.IsHttps;

            // ==========================
            // Cookies
            // ==========================

            if (response.Headers.TryGetValues("Set-Cookie", out var cookies))
            {
                foreach (var cookie in cookies)
                {
                    if (cookie.Contains("Secure"))
                        result.UsesSecureCookies = true;

                    if (cookie.Contains("HttpOnly"))
                        result.UsesHttpOnlyCookies = true;
                }
            }

            if (result.IsHttps)
            {
                var host = new Uri(url).Host;

                result.OpenPorts = await _portScanner.ScanAsync(host);

                var certificate = await _sslService.GetCertificateAsync(host);

                if (certificate != null)
                {
                    // Convert certificate expiry to UTC
                    var expiryDateUtc = certificate.NotAfter.ToUniversalTime();

                    result.CertificateIssuer = certificate.Issuer;
                    result.CertificateSubject = certificate.Subject;

                    result.CertificateExpiryDate = expiryDateUtc;

                    result.DaysUntilExpiry =
                        (expiryDateUtc - DateTime.UtcNow).Days;

                    result.IsCertificateExpired =
                        expiryDateUtc < DateTime.UtcNow;

                    result.IsCertificateValid =
                        !result.IsCertificateExpired;
                }
            }

            // ==========================
            // Security Score
            // ==========================

            int score = 0;

            if (result.IsHttps)
                score += 15;

            if (result.StatusCode == 200)
                score += 10;

            if (result.HasHsts)
                score += 10;

            if (result.HasCsp)
                score += 10;

            if (result.HasXFrameOptions)
                score += 10;

            if (result.HasXContentTypeOptions)
                score += 10;

            if (result.HasReferrerPolicy)
                score += 10;

            if (result.HasPermissionsPolicy)
                score += 10;

            if (result.UsesSecureCookies)
                score += 5;

            if (result.UsesHttpOnlyCookies)
                score += 5;

            if (result.IsCertificateValid)
                score += 5;

            result.SecurityScore = score;

            // ==========================
            // Grade
            // ==========================

            result.Grade = CalculateGrade(score);
            result.Recommendations = GenerateRecommendations(result);
            result.Vulnerabilities = DetectVulnerabilities(result);
        }
        catch
        {
            stopwatch.Stop();

            result.IsOnline = false;
            result.SecurityScore = 0;
            result.Grade = "F";
        }

        return result;
    }

    private static string CalculateGrade(int score)
    {
        if (score >= 95)
            return "A+";

        if (score >= 90)
            return "A";

        if (score >= 80)
            return "B";

        if (score >= 70)
            return "C";

        if (score >= 60)
            return "D";

        return "F";
    }

    private static List<SecurityRecommendation> GenerateRecommendations(ScanResult result)
    {
        var recommendations = new List<SecurityRecommendation>();

        if (!result.IsHttps)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "Enable HTTPS",
                Description = "Use HTTPS to encrypt communication between the client and server.",
                Severity = "High"
            });
        }

        if (!result.HasHsts)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "Enable HSTS",
                Description = "Configure the Strict-Transport-Security header.",
                Severity = "High"
            });
        }

        if (!result.HasCsp)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "Content Security Policy",
                Description = "Add a Content-Security-Policy header to reduce XSS attacks.",
                Severity = "High"
            });
        }

        if (!result.HasXFrameOptions)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "X-Frame-Options",
                Description = "Prevent clickjacking attacks by adding the X-Frame-Options header.",
                Severity = "Medium"
            });
        }

        if (!result.HasXContentTypeOptions)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "X-Content-Type-Options",
                Description = "Set X-Content-Type-Options: nosniff.",
                Severity = "Medium"
            });
        }

        if (!result.HasReferrerPolicy)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "Referrer Policy",
                Description = "Configure a Referrer-Policy header.",
                Severity = "Low"
            });
        }

        if (!result.HasPermissionsPolicy)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "Permissions Policy",
                Description = "Limit browser feature access with a Permissions-Policy header.",
                Severity = "Low"
            });
        }

        if (!result.UsesSecureCookies)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "Secure Cookies",
                Description = "Mark cookies with the Secure attribute.",
                Severity = "Medium"
            });
        }

        if (!result.UsesHttpOnlyCookies)
        {
            recommendations.Add(new SecurityRecommendation
            {
                Title = "HttpOnly Cookies",
                Description = "Mark cookies as HttpOnly to reduce XSS risks.",
                Severity = "Medium"
            });
        }

        return recommendations;
    }

    private static List<Vulnerability> DetectVulnerabilities(ScanResult result)
    {
        var vulnerabilities = new List<Vulnerability>();

        if (!result.IsHttps)
        {
            vulnerabilities.Add(new Vulnerability
            {
                Name = "Insecure HTTP",
                Severity = "Critical",
                Description = "Website is not using HTTPS.",
                Recommendation = "Enable HTTPS with a valid TLS certificate."
            });
        }

        if (!result.HasHsts)
        {
            vulnerabilities.Add(new Vulnerability
            {
                Name = "Missing HSTS",
                Severity = "High",
                Description = "HSTS header is missing.",
                Recommendation = "Enable Strict-Transport-Security."
            });
        }

        if (!result.HasCsp)
        {
            vulnerabilities.Add(new Vulnerability
            {
                Name = "Missing Content Security Policy",
                Severity = "High",
                Description = "CSP header is missing.",
                Recommendation = "Implement a Content-Security-Policy header."
            });
        }

        if (!result.HasXFrameOptions)
        {
            vulnerabilities.Add(new Vulnerability
            {
                Name = "Clickjacking Protection Missing",
                Severity = "Medium",
                Description = "X-Frame-Options header not found.",
                Recommendation = "Add X-Frame-Options: DENY or SAMEORIGIN."
            });
        }

        if (!result.UsesHttpOnlyCookies)
        {
            vulnerabilities.Add(new Vulnerability
            {
                Name = "Cookies Missing HttpOnly",
                Severity = "Medium",
                Description = "Cookies can be accessed by JavaScript.",
                Recommendation = "Mark cookies as HttpOnly."
            });
        }

        if (!result.UsesSecureCookies)
        {
            vulnerabilities.Add(new Vulnerability
            {
                Name = "Cookies Missing Secure Flag",
                Severity = "Medium",
                Description = "Cookies may be sent over insecure connections.",
                Recommendation = "Mark cookies with the Secure attribute."
            });
        }

        if (result.ServerHeader != "Hidden")
        {
            vulnerabilities.Add(new Vulnerability
            {
                Name = "Server Information Disclosure",
                Severity = "Low",
                Description = $"Server header exposed: {result.ServerHeader}",
                Recommendation = "Hide or minimize the Server header."
            });
        }

        return vulnerabilities;
    }
}