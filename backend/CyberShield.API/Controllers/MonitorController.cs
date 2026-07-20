using System.Security.Claims;
using CyberShield.Application.DTOs.Monitor;
using CyberShield.Application.Interfaces;
using CyberShield.Domain.Entities;
using CyberShield.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CyberShield.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MonitorController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IWebsiteScanner _scanner;
    private readonly IEmailService _emailService;

    public MonitorController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IWebsiteScanner scanner,
        IEmailService emailService)
    {
        _context = context;
        _userManager = userManager;
        _scanner = scanner;
        _emailService = emailService;
    }

    private Task CreateAlert(
        int monitoredWebsiteId,
        string title,
        string description,
        string severity)
    {
        _context.SecurityAlerts.Add(new SecurityAlert
        {
            MonitoredWebsiteId = monitoredWebsiteId,
            Title = title,
            Description = description,
            Severity = severity,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        return Task.CompletedTask;
    }

    private async Task SendSecurityAlertEmailAsync(
        string email,
        string website,
        string title,
        string description,
        string severity)
    {
        var html = $"""
            <h2>🚨 CyberShield Security Alert</h2>

            <p>A security issue has been detected on one of your monitored websites.</p>

            <table style="border-collapse:collapse">
                <tr>
                    <td><strong>Website</strong></td>
                    <td>{website}</td>
                </tr>
                <tr>
                    <td><strong>Alert</strong></td>
                    <td>{title}</td>
                </tr>
                <tr>
                    <td><strong>Severity</strong></td>
                    <td>{severity}</td>
                </tr>
                <tr>
                    <td><strong>Description</strong></td>
                    <td>{description}</td>
                </tr>
                <tr>
                    <td><strong>Detected At</strong></td>
                    <td>{DateTime.UtcNow:dd MMM yyyy HH:mm:ss} UTC</td>
                </tr>
            </table>

            <br/>

            <p>Please log in to CyberShield and review this issue immediately.</p>

            <hr/>

            <p><b>CyberShield Security Platform</b></p>
            """;

        await _emailService.SendEmailAsync(
            email,
            $"🚨 {title}",
            html);
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync()
    {
        return await _userManager.GetUserAsync(User);
    }

    [HttpPost]
    public async Task<IActionResult> AddWebsite(AddWebsiteDto dto)
    {
        var user = await GetCurrentUserAsync();

        if (user == null)
            return Unauthorized();

        var url = dto.Url.Trim();

        if (string.IsNullOrWhiteSpace(url))
            return BadRequest("Website URL is required.");

        bool exists = await _context.MonitoredWebsites.AnyAsync(x =>
            x.ApplicationUserId == user.Id &&
            x.Url.ToLower() == url.ToLower());

        if (exists)
            return BadRequest("Website already exists.");

        var website = new MonitoredWebsite
        {
            Url = url,
            ApplicationUserId = user.Id
        };

        _context.MonitoredWebsites.Add(website);

        await _context.SaveChangesAsync();

        _context.NotificationPreferences.Add(new NotificationPreference
        {
            MonitoredWebsiteId = website.Id
        });

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Website added successfully."
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var user = await GetCurrentUserAsync();

        if (user == null)
            return Unauthorized();

        var websites = await _context.MonitoredWebsites
            .Where(x => x.ApplicationUserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new MonitorWebsiteDto
            {
                Id = x.Id,
                Url = x.Url,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt,
                LastScanAt = x.LastScanAt
            })
            .ToListAsync();

        return Ok(websites);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await GetCurrentUserAsync();

        if (user == null)
            return Unauthorized();

        var website = await _context.MonitoredWebsites
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.ApplicationUserId == user.Id);

        if (website == null)
            return NotFound();

        _context.MonitoredWebsites.Remove(website);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Website deleted successfully."
        });
    }

    [HttpPost("{id}/scan")]
    public async Task<IActionResult> ScanWebsite(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var currentUser = await _userManager.FindByIdAsync(userId);

        if (currentUser == null)
            return Unauthorized();

        var monitoredWebsite = await _context.MonitoredWebsites
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.ApplicationUserId == userId);

        if (monitoredWebsite == null)
            return NotFound("Website not found.");

        var result = await _scanner.ScanAsync(monitoredWebsite.Url);

        var previousScan = await _context.Websites
            .Where(x =>
                x.ApplicationUserId == userId &&
                x.Url == monitoredWebsite.Url)
            .OrderByDescending(x => x.ScanDate)
            .FirstOrDefaultAsync();
        var preference = await _context.NotificationPreferences
    .FirstOrDefaultAsync(x =>
        x.MonitoredWebsiteId == monitoredWebsite.Id);

        // Website Offline
        if (!result.IsOnline)
        {
            string title = "Website Offline";
            string description = $"{monitoredWebsite.Url} is currently unreachable.";

            await CreateAlert(
                monitoredWebsite.Id,
                title,
                description,
                "Critical");

            if (preference?.EmailEnabled == true &&
    preference.WebsiteOffline)
            {
                await SendSecurityAlertEmailAsync(
                    currentUser.Email!,
                    monitoredWebsite.Url,
                    title,
                    description,
                    "Critical");
            }
        }

        // Invalid SSL Certificate
        if (!result.IsCertificateValid)
        {
            string title = "Invalid SSL Certificate";
            string description = $"{monitoredWebsite.Url} has an invalid SSL certificate.";

            await CreateAlert(
                monitoredWebsite.Id,
                title,
                description,
                "Critical");

            if (preference?.EmailEnabled == true &&
    preference.InvalidSsl)
            {
                await SendSecurityAlertEmailAsync(
                    currentUser.Email!,
                    monitoredWebsite.Url,
                    title,
                    description,
                    "Critical");
            }
        }

        // HTTPS Disabled
        if (!result.IsHttps)
        {
            string title = "HTTPS Disabled";
            string description = $"{monitoredWebsite.Url} is not using HTTPS.";

            await CreateAlert(
                monitoredWebsite.Id,
                title,
                description,
                "High");

            if (preference?.EmailEnabled == true &&
    preference.HttpsDisabled)
            {
                await SendSecurityAlertEmailAsync(
                    currentUser.Email!,
                    monitoredWebsite.Url,
                    title,
                    description,
                    "High");
            }
            ;
        }

        // SSL Expiring Soon
        if (result.DaysUntilExpiry > 0 &&
            result.DaysUntilExpiry <= 30)
        {
            string title = "SSL Expiring Soon";
            string description = $"SSL certificate expires in {result.DaysUntilExpiry} days.";

            await CreateAlert(
                monitoredWebsite.Id,
                title,
                description,
                "Medium");

            if (preference?.EmailEnabled == true &&
    preference.SslExpiringSoon)
            {
                await SendSecurityAlertEmailAsync(
                    currentUser.Email!,
                    monitoredWebsite.Url,
                    title,
                    description,
                    "Medium");
            }
        }

        // SSL Expired
        if (result.IsCertificateExpired)
        {
            string title = "SSL Certificate Expired";
            string description = $"{monitoredWebsite.Url} certificate has expired.";

            await CreateAlert(
                monitoredWebsite.Id,
                title,
                description,
                "Critical");

            if (preference?.EmailEnabled == true &&
    preference.SslExpired)
            {
                await SendSecurityAlertEmailAsync(
                    currentUser.Email!,
                    monitoredWebsite.Url,
                    title,
                    description,
                    "Critical");
            }
        }

        // Slow Website
        if (result.ResponseTime > 3000)
        {
            string title = "Slow Response Time";
            string description = $"Website responded in {result.ResponseTime} ms.";

            await CreateAlert(
                monitoredWebsite.Id,
                title,
                description,
                "Low");

            if (preference?.EmailEnabled == true &&
    preference.SlowResponse)
            {
                await SendSecurityAlertEmailAsync(
                    currentUser.Email!,
                    monitoredWebsite.Url,
                    title,
                    description,
                    "Low");
            }
        }

        // Security Score Dropped
        if (previousScan != null &&
            previousScan.SecurityScore - result.SecurityScore >= 10)
        {
            string title = "Security Score Dropped";
            string description = $"Score dropped from {previousScan.SecurityScore} to {result.SecurityScore}.";

            await CreateAlert(
                monitoredWebsite.Id,
                title,
                description,
                "High");

            if (preference?.EmailEnabled == true &&
    preference.SecurityScoreDropped)
            {
                await SendSecurityAlertEmailAsync(
                    currentUser.Email!,
                    monitoredWebsite.Url,
                    title,
                    description,
                    "High");
            }
        }

        // Save scan history
        var website = new Website
        {
            Url = result.Url,
            IsOnline = result.IsOnline,
            IsHttps = result.IsHttps,
            StatusCode = result.StatusCode,
            ResponseTime = result.ResponseTime,

            HasHsts = result.HasHsts,
            HasCsp = result.HasCsp,
            HasXFrameOptions = result.HasXFrameOptions,
            HasXContentTypeOptions = result.HasXContentTypeOptions,
            HasReferrerPolicy = result.HasReferrerPolicy,
            HasPermissionsPolicy = result.HasPermissionsPolicy,

            UsesSecureCookies = result.UsesSecureCookies,
            UsesHttpOnlyCookies = result.UsesHttpOnlyCookies,
            RedirectsToHttps = result.RedirectsToHttps,

            ServerHeader = result.ServerHeader,

            SecurityScore = result.SecurityScore,
            Grade = result.Grade,

            CertificateIssuer = result.CertificateIssuer,
            CertificateSubject = result.CertificateSubject,
            CertificateExpiryDate = result.CertificateExpiryDate,
            DaysUntilExpiry = result.DaysUntilExpiry,
            IsCertificateExpired = result.IsCertificateExpired,
            IsCertificateValid = result.IsCertificateValid,

            ScanDate = DateTime.UtcNow,
            ApplicationUserId = userId
        };

        _context.Websites.Add(website);

        monitoredWebsite.LastScanAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(result);
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var monitoredWebsite = await _context.MonitoredWebsites
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.ApplicationUserId == userId);

        if (monitoredWebsite == null)
            return NotFound();

        var history = await _context.Websites
            .Where(x =>
                x.ApplicationUserId == userId &&
                x.Url == monitoredWebsite.Url)
            .OrderByDescending(x => x.ScanDate)
            .Select(x => new
            {
                x.Id,
                x.ScanDate,
                x.SecurityScore,
                x.Grade,
                x.StatusCode,
                x.ResponseTime,
                x.IsHttps,
                x.IsCertificateValid
            })
            .ToListAsync();

        return Ok(history);
    }
}