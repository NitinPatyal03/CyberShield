using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Domain.Entities;

public class Website
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}