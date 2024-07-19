using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WagsMediaRepository.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPurchasedToBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPurchased",
                schema: "book",
                table: "Book",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPurchased",
                schema: "book",
                table: "Book");
        }
    }
}
