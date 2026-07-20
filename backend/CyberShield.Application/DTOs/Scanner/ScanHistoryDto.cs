using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs.Scanner;

public class ScanHistoryDto
{
    public int Id { get; set; }

    public string Url { get; set; } = string.Empty;

    public int StatusCode { get; set; }

    public long ResponseTime { get; set; }

    public int SecurityScore { get; set; }

    public string Grade { get; set; } = string.Empty;

    public bool IsHttps { get; set; }

    public bool IsCertificateValid { get; set; }

    public DateTime ScanDate { get; set; }
}
