using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; set; }

    public string Action { get; set; } = string.Empty;

    public string PerformedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
