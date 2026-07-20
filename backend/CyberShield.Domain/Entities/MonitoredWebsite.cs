using System.ComponentModel.DataAnnotations;

namespace CyberShield.Domain.Entities;

public class MonitoredWebsite
{
    public int Id { get; set; }

    [Required]
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastScanAt { get; set; }

    // Owner
    public string ApplicationUserId { get; set; } = string.Empty;

    public ApplicationUser ApplicationUser { get; set; } = null!;
}