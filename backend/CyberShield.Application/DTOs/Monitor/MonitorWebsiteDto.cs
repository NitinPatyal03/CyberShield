using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs.Monitor;

public class MonitorWebsiteDto
{
    public int Id { get; set; }

    public string Url { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastScanAt { get; set; }
}