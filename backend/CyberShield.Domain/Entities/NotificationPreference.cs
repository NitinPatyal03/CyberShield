using System.ComponentModel.DataAnnotations;

namespace CyberShield.Domain.Entities;

public class NotificationPreference
{
    public int Id { get; set; }

    [Required]
    public int MonitoredWebsiteId { get; set; }

    public MonitoredWebsite MonitoredWebsite { get; set; } = null!;

    public bool EmailEnabled { get; set; } = true;

    public bool WebsiteOffline { get; set; } = true;

    public bool InvalidSsl { get; set; } = true;

    public bool HttpsDisabled { get; set; } = true;

    public bool SslExpiringSoon { get; set; } = true;

    public bool SslExpired { get; set; } = true;

    public bool SlowResponse { get; set; } = true;

    public bool SecurityScoreDropped { get; set; } = true;
}