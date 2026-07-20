using System.Security.Claims;
using CyberShield.Domain.Entities;
using CyberShield.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CyberShield.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AlertsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AlertsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        // GET: api/alerts
        [HttpGet]
        public async Task<IActionResult> GetAlerts()
        {
            var userId = GetUserId();

            var alerts = await _context.SecurityAlerts
                .Include(a => a.MonitoredWebsite)
                .Where(a => a.MonitoredWebsite.ApplicationUserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    Website = a.MonitoredWebsite.Url,
                    a.Title,
                    a.Description,
                    a.Severity,
                    a.IsRead,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(alerts);
        }

        // GET: api/alerts/unread-count
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = GetUserId();

            var count = await _context.SecurityAlerts
                .Include(a => a.MonitoredWebsite)
                .CountAsync(a =>
                    !a.IsRead &&
                    a.MonitoredWebsite.ApplicationUserId == userId);

            return Ok(count);
        }

        // PATCH: api/alerts/5/read
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetUserId();

            var alert = await _context.SecurityAlerts
                .Include(a => a.MonitoredWebsite)
                .FirstOrDefaultAsync(a =>
                    a.Id == id &&
                    a.MonitoredWebsite.ApplicationUserId == userId);

            if (alert == null)
                return NotFound();

            alert.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Alert marked as read."
            });
        }

        // PATCH: api/alerts/read-all
        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = GetUserId();

            var alerts = await _context.SecurityAlerts
                .Include(a => a.MonitoredWebsite)
                .Where(a =>
                    !a.IsRead &&
                    a.MonitoredWebsite.ApplicationUserId == userId)
                .ToListAsync();

            foreach (var alert in alerts)
            {
                alert.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "All alerts marked as read."
            });
        }

        // DELETE: api/alerts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlert(int id)
        {
            var userId = GetUserId();

            var alert = await _context.SecurityAlerts
                .Include(a => a.MonitoredWebsite)
                .FirstOrDefaultAsync(a =>
                    a.Id == id &&
                    a.MonitoredWebsite.ApplicationUserId == userId);

            if (alert == null)
                return NotFound();

            _context.SecurityAlerts.Remove(alert);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Alert deleted successfully."
            });
        }
    }
}