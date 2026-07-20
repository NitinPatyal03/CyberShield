using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs.Monitor;

public class MonitorHistoryDto
{
    public int Id { get; set; }

    public DateTime ScanDate { get; set; }

    public int SecurityScore { get; set; }

    public string Grade { get; set; } = string.Empty;

    public int StatusCode { get; set; }

    public long ResponseTime { get; set; }

    public bool IsHttps { get; set; }

    public bool IsCertificateValid { get; set; }
}