using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyberShield.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedSecurityChecks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "Websites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "HasPermissionsPolicy",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasReferrerPolicy",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasXContentTypeOptions",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsCertificateValid",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RedirectsToHttps",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ServerHeader",
                table: "Websites",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "UsesHttpOnlyCookies",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "UsesSecureCookies",
                table: "Websites",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "HasPermissionsPolicy",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "HasReferrerPolicy",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "HasXContentTypeOptions",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "IsCertificateValid",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "RedirectsToHttps",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "ServerHeader",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "UsesHttpOnlyCookies",
                table: "Websites");

            migrationBuilder.DropColumn(
                name: "UsesSecureCookies",
                table: "Websites");
        }
    }
}
