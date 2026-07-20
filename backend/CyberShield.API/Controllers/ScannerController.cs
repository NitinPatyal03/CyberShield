using System.Security.Claims;
using CyberShield.Application.DTOs.Scanner;
using CyberShield.Application.Interfaces;
using CyberShield.Domain.Entities;
using CyberShield.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CyberShield.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ScannerController : ControllerBase
{
    private readonly IWebsiteScanner _scanner;
    private readonly ApplicationDbContext _context;

    public ScannerController(
        IWebsiteScanner scanner,
        ApplicationDbContext context)
    {
        _scanner = scanner;
        _context = context;
    }

    [HttpPost("scan")]
    public async Task<IActionResult> Scan(ScanRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest("URL is required.");
        }

        // Get logged-in user's Id from JWT
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token.");
        }

        var result = await _scanner.ScanAsync(request.Url);

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
            ScanDate = DateTime.UtcNow,

            CertificateIssuer = result.CertificateIssuer,
            CertificateSubject = result.CertificateSubject,
            CertificateExpiryDate = result.CertificateExpiryDate,
            DaysUntilExpiry = result.DaysUntilExpiry,
            IsCertificateExpired = result.IsCertificateExpired,
            IsCertificateValid = result.IsCertificateValid,

            // Save current logged-in user
            ApplicationUserId = userId
        };

        _context.Websites.Add(website);
        await _context.SaveChangesAsync();

        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> History()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token.");
        }

        var history = await _context.Websites
    .Where(x => x.ApplicationUserId == userId)
    .OrderByDescending(x => x.ScanDate)
    .Select(x => new ScanHistoryDto
    {
        Id = x.Id,
        Url = x.Url,
        StatusCode = x.StatusCode,
        ResponseTime = x.ResponseTime,
        SecurityScore = x.SecurityScore,
        Grade = x.Grade,
        IsHttps = x.IsHttps,
        IsCertificateValid = x.IsCertificateValid,
        ScanDate = x.ScanDate
    })
    .ToListAsync();

        return Ok(history);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var website = await _context.Websites.FirstOrDefaultAsync(x =>
            x.Id == id &&
            x.ApplicationUserId == userId);

        if (website == null)
            return NotFound();

        _context.Websites.Remove(website);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Scan deleted successfully."
        });
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var website = await _context.Websites
            .Where(x => x.Id == id &&
                        x.ApplicationUserId == userId)
            .FirstOrDefaultAsync();

        if (website == null)
            return NotFound();

        return Ok(website);
    }
}