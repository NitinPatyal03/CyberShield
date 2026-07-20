using CyberShield.Application.DTOs.Scanner;
using CyberShield.Application.Interfaces;

namespace CyberShield.Infrastructure.Reports;

public class PdfReportService : IPdfReportService
{
    public byte[] GenerateReport(ScanResult result)
    {
        // Temporary implementation
        return Array.Empty<byte>();
    }
}