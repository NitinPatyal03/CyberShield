using System.Security.Claims;
using CyberShield.Application.DTOs.Dashboard;
using CyberShield.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CyberShield.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var scans = await _context.Websites
            .Where(x => x.ApplicationUserId == userId)
            .OrderByDescending(x => x.ScanDate)
            .ToListAsync();

        var dto = new DashboardDto
        {
            TotalScans = scans.Count,

            AverageScore = scans.Count == 0
                ? 0
                : Math.Round(scans.Average(x => x.SecurityScore), 2),

            BestGrade = scans.Count == 0
                ? "-"
                : scans.OrderBy(x => x.SecurityScore)
                       .Last()
                       .Grade,

            TotalHighRisk = scans.Count(x => x.SecurityScore < 50),

            RecentScans = scans
                .Take(5)
                .Select(x => new RecentScanDto
                {
                    Id = x.Id,
                    Url = x.Url,
                    Score = x.SecurityScore,
                    Grade = x.Grade,
                    ScanDate = x.ScanDate
                })
                .ToList()
        };

        return Ok(dto);
    }
}