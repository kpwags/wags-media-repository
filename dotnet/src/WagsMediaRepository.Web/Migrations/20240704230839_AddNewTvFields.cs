using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WagsMediaRepository.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddNewTvFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfSeasons",
                schema: "tv",
                table: "TelevisionShow",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                schema: "tv",
                table: "TelevisionShow",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfSeasons",
                schema: "tv",
                table: "TelevisionShow");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                schema: "tv",
                table: "TelevisionShow");
        }
    }
}
