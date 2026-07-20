using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs.Scanner;

public class PortResult
{
    public int Port { get; set; }

    public string Service { get; set; } = string.Empty;

    public bool IsOpen { get; set; }
}