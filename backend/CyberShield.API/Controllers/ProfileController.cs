using System.Security.Claims;
using CyberShield.Application.DTOs;
using CyberShield.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CyberShield.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);

        if (email == null)
            return Unauthorized();

        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
            return NotFound();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            id = user.Id,
            firstName = user.FirstName,
            lastName = user.LastName,
            email = user.Email,
            role = roles.FirstOrDefault() ?? "User"
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
    {
        var email = User.FindFirstValue(ClaimTypes.Email);

        if (email == null)
            return Unauthorized();

        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
            return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new
        {
            message = "Profile updated successfully."
        });
    }
}