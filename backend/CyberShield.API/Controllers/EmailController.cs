using CyberShield.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberShield.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("test")]
    public async Task<IActionResult> SendTestEmail()
    {
        await _emailService.SendEmailAsync(
            "nitinpatyal.work@gmail.com",
            "CyberShield Test Email",
            """
            <h2>CyberShield</h2>

            <p>If you received this email, your email service is working successfully.</p>

            <hr/>

            <p>This is a test email sent using Brevo SMTP.</p>
            """
        );

        return Ok(new
        {
            message = "Test email sent successfully."
        });
    }
}