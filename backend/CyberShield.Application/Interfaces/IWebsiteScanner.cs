using CyberShield.Application.DTOs.Scanner;

namespace CyberShield.Application.Interfaces;

public interface IWebsiteScanner
{
    Task<ScanResult> ScanAsync(string url);
}