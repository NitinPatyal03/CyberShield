using System.Text;
using CyberShield.Application.Interfaces;
using CyberShield.Domain.Entities;
using CyberShield.Infrastructure;
using CyberShield.Infrastructure.Data;
using CyberShield.Infrastructure.Reports;
using CyberShield.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

builder.Services.AddHttpClient<IWebsiteScanner, WebsiteScanner>();
builder.Services.AddScoped<SslCertificateService>();
builder.Services.AddScoped<PortScannerService>();
builder.Services.AddScoped<PdfReportService, PdfReportService>();
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddScoped<IEmailService, EmailService>();
// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
        )
    };
});

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://cyber-shield-lac-rho.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});



var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();



if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}
app.UseCors("ReactPolicy");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();

    await CyberShield.API.Seed.RoleSeeder.SeedAsync(roleManager);
}

app.Run();