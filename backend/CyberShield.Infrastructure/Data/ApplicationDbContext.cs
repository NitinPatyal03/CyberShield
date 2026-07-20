using CyberShield.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CyberShield.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Website> Websites => Set<Website>();
    public DbSet<SecurityAlert> SecurityAlerts { get; set; }
    public DbSet<Device> Devices => Set<Device>();

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<NotificationPreference> NotificationPreferences { get; set; }
    public DbSet<MonitoredWebsite> MonitoredWebsites { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Website>()
    .HasOne(w => w.User)
    .WithMany(u => u.Websites)
    .HasForeignKey(w => w.ApplicationUserId)
    .OnDelete(DeleteBehavior.Cascade);
    }
}