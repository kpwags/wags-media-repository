using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WagsMediaRepository.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddShowOnNowToMusic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowOnNowPage",
                schema: "music",
                table: "MusicAlbum",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowOnNowPage",
                schema: "music",
                table: "MusicAlbum");
        }
    }
}
