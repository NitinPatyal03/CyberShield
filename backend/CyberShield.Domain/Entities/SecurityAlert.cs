using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Domain.Entities
{
    public class SecurityAlert
    {
        public int Id { get; set; }

        public int MonitoredWebsiteId { get; set; }

        public MonitoredWebsite MonitoredWebsite { get; set; } = null!;

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Severity { get; set; } = "Medium";

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
