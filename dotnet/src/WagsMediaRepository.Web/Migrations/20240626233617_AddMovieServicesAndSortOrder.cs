using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WagsMediaRepository.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieServicesAndSortOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                schema: "movie",
                table: "Movie",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MovieService",
                schema: "movie",
                columns: table => new
                {
                    MovieServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movie_MovieService", x => x.MovieServiceId);
                });

            migrationBuilder.CreateTable(
                name: "MovieToMovieService",
                schema: "movie",
                columns: table => new
                {
                    MovieToMovieServicId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MovieId = table.Column<int>(type: "INTEGER", nullable: false),
                    MovieServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movie_MovieToMovieService", x => x.MovieToMovieServicId);
                    table.ForeignKey(
                        name: "FK_MovieToMovieService_MovieService_MovieServiceId",
                        column: x => x.MovieServiceId,
                        principalSchema: "movie",
                        principalTable: "MovieService",
                        principalColumn: "MovieServiceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MovieToMovieService_Movie_MovieId",
                        column: x => x.MovieId,
                        principalSchema: "movie",
                        principalTable: "Movie",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieToMovieService_MovieServiceId",
                schema: "movie",
                table: "MovieToMovieService",
                column: "MovieServiceId");

            migrationBuilder.CreateIndex(
                name: "UQ_Movie_MovieToMovieService_MovieId_MovieServiceId",
                schema: "movie",
                table: "MovieToMovieService",
                columns: new[] { "MovieId", "MovieServiceId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieToMovieService",
                schema: "movie");

            migrationBuilder.DropTable(
                name: "MovieService",
                schema: "movie");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                schema: "movie",
                table: "Movie");
        }
    }
}
