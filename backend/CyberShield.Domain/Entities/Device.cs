using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Domain.Entities;

public class Device
{
    public Guid Id { get; set; }

    public string Hostname { get; set; } = string.Empty;

    public string IpAddress { get; set; } = string.Empty;

    public string MacAddress { get; set; } = string.Empty;

    public bool IsOnline { get; set; }

    public DateTime LastSeen { get; set; }
}
