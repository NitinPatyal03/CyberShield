using CyberShield.Domain.Entities;

namespace CyberShield.Application.Interfaces;

public interface IJwtService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
}