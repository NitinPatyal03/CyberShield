using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalScans { get; set; }

    public double AverageScore { get; set; }

    public string BestGrade { get; set; } = "F";

    public int TotalHighRisk { get; set; }

    public List<RecentScanDto> RecentScans { get; set; } = [];
}

public class RecentScanDto
{
    public int Id { get; set; }

    public string Url { get; set; } = "";

    public int Score { get; set; }

    public string Grade { get; set; } = "";

    public DateTime ScanDate { get; set; }
}