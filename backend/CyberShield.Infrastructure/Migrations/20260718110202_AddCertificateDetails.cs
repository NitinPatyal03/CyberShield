using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyberShield.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCertificateDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CertificateExpiryDate",
                table: "Websites",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CertificateIssuer",
                table: "Websites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CertificateSubject",
                table: "Websites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DaysUntilExpiry",
                table: "Websites",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsCertificateExpired",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificateExpiryDate",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "CertificateIssuer",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "CertificateSubject",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "DaysUntilExpiry",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "IsCertificateExpired",
                table: "Websites");
        }
    }
}
