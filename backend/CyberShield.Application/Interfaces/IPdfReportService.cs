using CyberShield.Application.DTOs.Scanner;

namespace CyberShield.Application.Interfaces;

public interface IPdfReportService
{
    byte[] GenerateReport(ScanResult result);
}