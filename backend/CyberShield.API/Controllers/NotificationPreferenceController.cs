using System.Security.Claims;
using CyberShield.Application.DTOs;
using CyberShield.Domain.Entities;
using CyberShield.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CyberShield.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationPreferenceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationPreferenceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{websiteId}")]
    public async Task<IActionResult> Get(int websiteId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var website = await _context.MonitoredWebsites
            .FirstOrDefaultAsync(x =>
                x.Id == websiteId &&
                x.ApplicationUserId == userId);

        if (website == null)
            return NotFound("Website not found.");

        var preference = await _context.NotificationPreferences
            .FirstOrDefaultAsync(x =>
                x.MonitoredWebsiteId == websiteId);

        if (preference == null)
        {
            preference = new NotificationPreference
            {
                MonitoredWebsiteId = websiteId,
                EmailEnabled = true,
                WebsiteOffline = true,
                InvalidSsl = true,
                HttpsDisabled = true,
                SslExpiringSoon = true,
                SslExpired = true,
                SlowResponse = true,
                SecurityScoreDropped = true
            };

            _context.NotificationPreferences.Add(preference);
            await _context.SaveChangesAsync();
        }

        return Ok(new NotificationPreferenceDto
        {
            EmailEnabled = preference.EmailEnabled,
            WebsiteOffline = preference.WebsiteOffline,
            InvalidSsl = preference.InvalidSsl,
            HttpsDisabled = preference.HttpsDisabled,
            SslExpiringSoon = preference.SslExpiringSoon,
            SslExpired = preference.SslExpired,
            SlowResponse = preference.SlowResponse,
            SecurityScoreDropped = preference.SecurityScoreDropped
        });
    }

    [HttpPut("{websiteId}")]
    public async Task<IActionResult> Update(
        int websiteId,
        NotificationPreferenceDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var website = await _context.MonitoredWebsites
            .FirstOrDefaultAsync(x =>
                x.Id == websiteId &&
                x.ApplicationUserId == userId);

        if (website == null)
            return NotFound("Website not found.");

        var preference = await _context.NotificationPreferences
            .FirstOrDefaultAsync(x =>
                x.MonitoredWebsiteId == websiteId);

        if (preference == null)
        {
            preference = new NotificationPreference
            {
                MonitoredWebsiteId = websiteId
            };

            _context.NotificationPreferences.Add(preference);
        }

        preference.EmailEnabled = dto.EmailEnabled;
        preference.WebsiteOffline = dto.WebsiteOffline;
        preference.InvalidSsl = dto.InvalidSsl;
        preference.HttpsDisabled = dto.HttpsDisabled;
        preference.SslExpiringSoon = dto.SslExpiringSoon;
        preference.SslExpired = dto.SslExpired;
        preference.SlowResponse = dto.SlowResponse;
        preference.SecurityScoreDropped = dto.SecurityScoreDropped;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Notification preferences updated successfully."
        });
    }

    [HttpPost("{websiteId}/reset")]
    public async Task<IActionResult> Reset(int websiteId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var website = await _context.MonitoredWebsites
            .FirstOrDefaultAsync(x =>
                x.Id == websiteId &&
                x.ApplicationUserId == userId);

        if (website == null)
            return NotFound("Website not found.");

        var preference = await _context.NotificationPreferences
            .FirstOrDefaultAsync(x =>
                x.MonitoredWebsiteId == websiteId);

        if (preference == null)
            return NotFound();

        preference.EmailEnabled = true;
        preference.WebsiteOffline = true;
        preference.InvalidSsl = true;
        preference.HttpsDisabled = true;
        preference.SslExpiringSoon = true;
        preference.SslExpired = true;
        preference.SlowResponse = true;
        preference.SecurityScoreDropped = true;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Notification preferences reset successfully."
        });
    }
}