using CyberShield.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CyberShield.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // ==========================================================
    // GET ALL USERS
    // ==========================================================
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userManager.Users
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email,
                u.PhoneNumber,
                u.IsActive,
                u.CreatedAt
            })
            .ToListAsync();

        var result = new List<object>();

        foreach (var user in users)
        {
            var appUser = await _userManager.FindByIdAsync(user.Id);

            var roles = await _userManager.GetRolesAsync(appUser!);

            result.Add(new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.IsActive,
                user.CreatedAt,
                Role = roles.FirstOrDefault() ?? "User"
            });
        }

        return Ok(result);
    }

    // ==========================================================
    // GET USER BY ID
    // ==========================================================
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found.");

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.PhoneNumber,
            user.IsActive,
            user.CreatedAt,
            Roles = roles
        });
    }

    // ==========================================================
    // BLOCK USER
    // ==========================================================
    [HttpPut("users/{id}/block")]
    public async Task<IActionResult> BlockUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found.");

        user.IsActive = false;

        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            Message = "User blocked successfully."
        });
    }

    // ==========================================================
    // UNBLOCK USER
    // ==========================================================
    [HttpPut("users/{id}/unblock")]
    public async Task<IActionResult> UnblockUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found.");

        user.IsActive = true;

        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            Message = "User unblocked successfully."
        });
    }

    // ==========================================================
    // DELETE USER
    // ==========================================================
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var currentUserId = _userManager.GetUserId(User);

        if (currentUserId == id)
        {
            return BadRequest("You cannot delete your own account.");
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found.");

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new
        {
            Message = "User deleted successfully."
        });
    }

    // ==========================================================
    // PROMOTE TO ADMIN
    // ==========================================================
    [HttpPut("users/{id}/make-admin")]
    public async Task<IActionResult> MakeAdmin(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found.");

        if (!await _userManager.IsInRoleAsync(user, "Admin"))
        {
            await _userManager.RemoveFromRoleAsync(user, "User");
            await _userManager.AddToRoleAsync(user, "Admin");
        }

        return Ok(new
        {
            Message = "User promoted to Admin successfully."
        });
    }

    // ==========================================================
    // DEMOTE TO USER
    // ==========================================================
    [HttpPut("users/{id}/make-user")]
    public async Task<IActionResult> MakeUser(string id)
    {
        var currentUserId = _userManager.GetUserId(User);

        if (currentUserId == id)
        {
            return BadRequest("You cannot remove your own admin role.");
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found.");

        if (!await _userManager.IsInRoleAsync(user, "User"))
        {
            await _userManager.RemoveFromRoleAsync(user, "Admin");
            await _userManager.AddToRoleAsync(user, "User");
        }

        return Ok(new
        {
            Message = "Admin changed to User successfully."
        });
    }

    // ==========================================================
    // DASHBOARD STATS
    // ==========================================================
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var totalUsers = await _userManager.Users.CountAsync();

        var activeUsers = await _userManager.Users
            .CountAsync(x => x.IsActive);

        var blockedUsers = await _userManager.Users
            .CountAsync(x => !x.IsActive);

        var admins = 0;

        foreach (var user in _userManager.Users)
        {
            if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                admins++;
            }
        }

        return Ok(new
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            BlockedUsers = blockedUsers,
            TotalAdmins = admins
        });
    }
}