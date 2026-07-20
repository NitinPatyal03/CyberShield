using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyberShield.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationPreference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationPreferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MonitoredWebsiteId = table.Column<int>(type: "int", nullable: false),
                    EmailEnabled = table.Column<bool>(type: "bit", nullable: false),
                    WebsiteOffline = table.Column<bool>(type: "bit", nullable: false),
                    InvalidSsl = table.Column<bool>(type: "bit", nullable: false),
                    HttpsDisabled = table.Column<bool>(type: "bit", nullable: false),
                    SslExpiringSoon = table.Column<bool>(type: "bit", nullable: false),
                    SslExpired = table.Column<bool>(type: "bit", nullable: false),
                    SlowResponse = table.Column<bool>(type: "bit", nullable: false),
                    SecurityScoreDropped = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationPreferences_MonitoredWebsites_MonitoredWebsiteId",
                        column: x => x.MonitoredWebsiteId,
                        principalTable: "MonitoredWebsites",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationPreferences_MonitoredWebsiteId",
                table: "NotificationPreferences",
                column: "MonitoredWebsiteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationPreferences");
        }
    }
}
