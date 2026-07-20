using System;
using System.Collections.Generic;
using System.Text;

namespace CyberShield.Application.DTOs;
public class NotificationPreferenceDto
{
    public bool EmailEnabled { get; set; }

    public bool WebsiteOffline { get; set; }

    public bool InvalidSsl { get; set; }

    public bool HttpsDisabled { get; set; }

    public bool SslExpiringSoon { get; set; }

    public bool SslExpired { get; set; }

    public bool SlowResponse { get; set; }

    public bool SecurityScoreDropped { get; set; }
}
