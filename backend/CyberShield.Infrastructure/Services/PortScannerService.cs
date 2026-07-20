using System.Net.Sockets;
using CyberShield.Application.DTOs.Scanner;

namespace CyberShield.Infrastructure.Services;

public class PortScannerService
{
    private readonly Dictionary<int, string> _ports = new()
    {
        {21,"FTP"},
        {22,"SSH"},
        {23,"Telnet"},
        {25,"SMTP"},
        {53,"DNS"},
        {80,"HTTP"},
        {110,"POP3"},
        {143,"IMAP"},
        {443,"HTTPS"},
        {3306,"MySQL"},
        {3389,"RDP"},
        {8080,"HTTP Alternate"}
    };

    public async Task<List<PortResult>> ScanAsync(string host)
    {
        var results = new List<PortResult>();

        foreach (var port in _ports)
        {
            using var client = new TcpClient();

            try
            {
                var connectTask = client.ConnectAsync(host, port.Key);

                var completed = await Task.WhenAny(connectTask, Task.Delay(500));

                results.Add(new PortResult
                {
                    Port = port.Key,
                    Service = port.Value,
                    IsOpen = completed == connectTask && client.Connected
                });
            }
            catch
            {
                results.Add(new PortResult
                {
                    Port = port.Key,
                    Service = port.Value,
                    IsOpen = false
                });
            }
        }

        return results;
    }
}