using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WagsMediaRepository.Web.Migrations
{
    /// <inheritdoc />
    public partial class ChangePodcastKeyType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PodcastId",
                schema: "podcast",
                table: "Podcast",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "PodcastId",
                schema: "podcast",
                table: "Podcast",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);
        }
    }
}
