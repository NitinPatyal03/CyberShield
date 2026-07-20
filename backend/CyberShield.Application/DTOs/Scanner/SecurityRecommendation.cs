using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs.Scanner;

public class SecurityRecommendation
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Severity { get; set; } = string.Empty;
}
