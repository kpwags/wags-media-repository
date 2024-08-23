using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WagsMediaRepository.Web.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "book");

            migrationBuilder.EnsureSchema(
                name: "link");

            migrationBuilder.EnsureSchema(
                name: "movie");

            migrationBuilder.EnsureSchema(
                name: "music");

            migrationBuilder.EnsureSchema(
                name: "podcast");

            migrationBuilder.EnsureSchema(
                name: "tv");

            migrationBuilder.EnsureSchema(
                name: "videogame");

            migrationBuilder.CreateTable(
                name: "BookFormat",
                schema: "book",
                columns: table => new
                {
                    BookFormatId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_BookFormat", x => x.BookFormatId);
                });

            migrationBuilder.CreateTable(
                name: "BookGenre",
                schema: "book",
                columns: table => new
                {
                    BookGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_BookGenre", x => x.BookGenreId);
                });

            migrationBuilder.CreateTable(
                name: "BookSeries",
                schema: "book",
                columns: table => new
                {
                    BookSeriesId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_BookSeries", x => x.BookSeriesId);
                });

            migrationBuilder.CreateTable(
                name: "BookStatus",
                schema: "book",
                columns: table => new
                {
                    BookStatusId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_BookStatus", x => x.BookStatusId);
                });

            migrationBuilder.CreateTable(
                name: "BookType",
                schema: "book",
                columns: table => new
                {
                    BookTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_BookType", x => x.BookTypeId);
                });

            migrationBuilder.CreateTable(
                name: "LinkCategory",
                schema: "link",
                columns: table => new
                {
                    LinkCategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Link_LinkCategory", x => x.LinkCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "LinkType",
                schema: "link",
                columns: table => new
                {
                    LinkTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Link_LinkType", x => x.LinkTypeId);
                });

            migrationBuilder.CreateTable(
                name: "MovieGenre",
                schema: "movie",
                columns: table => new
                {
                    MovieGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movie_MovieGenre", x => x.MovieGenreId);
                });

            migrationBuilder.CreateTable(
                name: "MovieStatus",
                schema: "movie",
                columns: table => new
                {
                    MovieStatusId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movie_MovieStatus", x => x.MovieStatusId);
                });

            migrationBuilder.CreateTable(
                name: "MusicAlbum",
                schema: "music",
                columns: table => new
                {
                    MusicAlbumId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Artist = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Thoughts = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false, defaultValue: ""),
                    CoverImageUrl = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    IsTopTen = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Music_MusicAlbum", x => x.MusicAlbumId);
                });

            migrationBuilder.CreateTable(
                name: "MusicFormat",
                schema: "music",
                columns: table => new
                {
                    MusicFormatId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Music_MusicFormat", x => x.MusicFormatId);
                });

            migrationBuilder.CreateTable(
                name: "MusicGenre",
                schema: "music",
                columns: table => new
                {
                    MusicGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Music_Genre", x => x.MusicGenreId);
                });

            migrationBuilder.CreateTable(
                name: "PodcastCategory",
                schema: "podcast",
                columns: table => new
                {
                    PodcastCategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Podcast_PodcastCategory", x => x.PodcastCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "TelevisionGenre",
                schema: "tv",
                columns: table => new
                {
                    TelevisionGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tv_TelevisionGenre", x => x.TelevisionGenreId);
                });

            migrationBuilder.CreateTable(
                name: "TelevisionService",
                schema: "tv",
                columns: table => new
                {
                    TelevisionServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tv_TelevisionService", x => x.TelevisionServiceId);
                });

            migrationBuilder.CreateTable(
                name: "TelevisionStatus",
                schema: "tv",
                columns: table => new
                {
                    TelevisionStatusId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tv_TelevisionStatus", x => x.TelevisionStatusId);
                });

            migrationBuilder.CreateTable(
                name: "VideoGameCompletion",
                schema: "videogame",
                columns: table => new
                {
                    VideoGameCompletionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videogame_VideoGameCompletion", x => x.VideoGameCompletionId);
                });

            migrationBuilder.CreateTable(
                name: "VideoGameGenre",
                schema: "videogame",
                columns: table => new
                {
                    VideoGameGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videogame_VideoGameGenre", x => x.VideoGameGenreId);
                });

            migrationBuilder.CreateTable(
                name: "VideoGameStatus",
                schema: "videogame",
                columns: table => new
                {
                    VideoGameStatusId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videogame_VideoGameStatus", x => x.VideoGameStatusId);
                });

            migrationBuilder.CreateTable(
                name: "VideoGameSystem",
                schema: "videogame",
                columns: table => new
                {
                    VideoGameSystemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false),
                    ColorCode = table.Column<string>(type: "TEXT", maxLength: 25, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videogame_VideoGameSystem", x => x.VideoGameSystemId);
                });

            migrationBuilder.CreateTable(
                name: "Book",
                schema: "book",
                columns: table => new
                {
                    BookId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BookStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    BookTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    BookSeriesId = table.Column<int>(type: "INTEGER", nullable: true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false, defaultValue: ""),
                    SubTitle = table.Column<string>(type: "TEXT", nullable: false),
                    Author = table.Column<string>(type: "TEXT", nullable: false),
                    Link = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    DateStarted = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DateCompleted = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    BookNotesUrl = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false, defaultValue: ""),
                    Thoughts = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false, defaultValue: ""),
                    CoverImageUrl = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    IsAtLibrary = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    CurrentPage = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 1),
                    PageCount = table.Column<int>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_Book", x => x.BookId);
                    table.ForeignKey(
                        name: "FK_Book_BookSeries_BookSeriesId",
                        column: x => x.BookSeriesId,
                        principalSchema: "book",
                        principalTable: "BookSeries",
                        principalColumn: "BookSeriesId");
                    table.ForeignKey(
                        name: "FK_Book_BookStatus_BookStatusId",
                        column: x => x.BookStatusId,
                        principalSchema: "book",
                        principalTable: "BookStatus",
                        principalColumn: "BookStatusId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Book_BookType_BookTypeId",
                        column: x => x.BookTypeId,
                        principalSchema: "book",
                        principalTable: "BookType",
                        principalColumn: "BookTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Link",
                schema: "link",
                columns: table => new
                {
                    LinkId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LinkTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    LinkCategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    Url = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LinkDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ReadingLogIssueNumber = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Link_Link", x => x.LinkId);
                    table.ForeignKey(
                        name: "FK_Link_LinkCategory_LinkCategoryId",
                        column: x => x.LinkCategoryId,
                        principalSchema: "link",
                        principalTable: "LinkCategory",
                        principalColumn: "LinkCategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Link_LinkType_LinkTypeId",
                        column: x => x.LinkTypeId,
                        principalSchema: "link",
                        principalTable: "LinkType",
                        principalColumn: "LinkTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Movie",
                schema: "movie",
                columns: table => new
                {
                    MovieId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MovieStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ImdbLink = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    DateWatched = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    Thoughts = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false, defaultValue: ""),
                    PosterImageUrl = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movie_Movie", x => x.MovieId);
                    table.ForeignKey(
                        name: "FK_Movie_MovieStatus_MovieStatusId",
                        column: x => x.MovieStatusId,
                        principalSchema: "movie",
                        principalTable: "MovieStatus",
                        principalColumn: "MovieStatusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MusicAlbumTrack",
                schema: "music",
                columns: table => new
                {
                    MusicAlbumTrackId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MusicAlbumId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    TrackNumber = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Music_MusicAlbumTrack", x => x.MusicAlbumTrackId);
                    table.ForeignKey(
                        name: "FK_MusicAlbumTrack_MusicAlbum_MusicAlbumId",
                        column: x => x.MusicAlbumId,
                        principalSchema: "music",
                        principalTable: "MusicAlbum",
                        principalColumn: "MusicAlbumId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MusicAlbumToMusicFormat",
                schema: "music",
                columns: table => new
                {
                    MusicAlbumToMusicFormatId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MusicAlbumId = table.Column<int>(type: "INTEGER", nullable: false),
                    MusicFormatId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Music_MusicAlbumToMusicFormat", x => x.MusicAlbumToMusicFormatId);
                    table.ForeignKey(
                        name: "FK_MusicAlbumToMusicFormat_MusicAlbum_MusicAlbumId",
                        column: x => x.MusicAlbumId,
                        principalSchema: "music",
                        principalTable: "MusicAlbum",
                        principalColumn: "MusicAlbumId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MusicAlbumToMusicFormat_MusicFormat_MusicFormatId",
                        column: x => x.MusicFormatId,
                        principalSchema: "music",
                        principalTable: "MusicFormat",
                        principalColumn: "MusicFormatId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MusicAlbumToMusicGenre",
                schema: "music",
                columns: table => new
                {
                    MusicAlbumToMusicGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MusicAlbumId = table.Column<int>(type: "INTEGER", nullable: false),
                    MusicGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Music_MusicAlbumToMusicGenre", x => x.MusicAlbumToMusicGenreId);
                    table.ForeignKey(
                        name: "FK_MusicAlbumToMusicGenre_MusicAlbum_MusicAlbumId",
                        column: x => x.MusicAlbumId,
                        principalSchema: "music",
                        principalTable: "MusicAlbum",
                        principalColumn: "MusicAlbumId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MusicAlbumToMusicGenre_MusicGenre_MusicGenreId",
                        column: x => x.MusicGenreId,
                        principalSchema: "music",
                        principalTable: "MusicGenre",
                        principalColumn: "MusicGenreId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Podcast",
                schema: "podcast",
                columns: table => new
                {
                    PodcastId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PodcastCategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Link = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Podcast_Podcast", x => x.PodcastId);
                    table.ForeignKey(
                        name: "FK_Podcast_PodcastCategory_PodcastCategoryId",
                        column: x => x.PodcastCategoryId,
                        principalSchema: "podcast",
                        principalTable: "PodcastCategory",
                        principalColumn: "PodcastCategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TelevisionShow",
                schema: "tv",
                columns: table => new
                {
                    TelevisionShowId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TelevisionStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ImdbLink = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    Thoughts = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false, defaultValue: ""),
                    CoverImageUrl = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    CurrentSeason = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tv_TelevisionShow", x => x.TelevisionShowId);
                    table.ForeignKey(
                        name: "FK_TelevisionShow_TelevisionStatus_TelevisionStatusId",
                        column: x => x.TelevisionStatusId,
                        principalSchema: "tv",
                        principalTable: "TelevisionStatus",
                        principalColumn: "TelevisionStatusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VideoGame",
                schema: "videogame",
                columns: table => new
                {
                    VideoGameId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VideoGameStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    VideoGameCompletionId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Link = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    DateStarted = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DateCompleted = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    Thoughts = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false, defaultValue: ""),
                    CoverImageUrl = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videogame_VideoGme", x => x.VideoGameId);
                    table.ForeignKey(
                        name: "FK_VideoGame_VideoGameCompletion_VideoGameCompletionId",
                        column: x => x.VideoGameCompletionId,
                        principalSchema: "videogame",
                        principalTable: "VideoGameCompletion",
                        principalColumn: "VideoGameCompletionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VideoGame_VideoGameStatus_VideoGameStatusId",
                        column: x => x.VideoGameStatusId,
                        principalSchema: "videogame",
                        principalTable: "VideoGameStatus",
                        principalColumn: "VideoGameStatusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookToBookFormat",
                schema: "book",
                columns: table => new
                {
                    BookToBookFormatId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BookId = table.Column<int>(type: "INTEGER", nullable: false),
                    BookFormatId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_BookToBookFormat", x => x.BookToBookFormatId);
                    table.ForeignKey(
                        name: "FK_BookToBookFormat_BookFormat_BookFormatId",
                        column: x => x.BookFormatId,
                        principalSchema: "book",
                        principalTable: "BookFormat",
                        principalColumn: "BookFormatId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookToBookFormat_Book_BookId",
                        column: x => x.BookId,
                        principalSchema: "book",
                        principalTable: "Book",
                        principalColumn: "BookId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BookToBookGenre",
                schema: "book",
                columns: table => new
                {
                    BookToBookGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BookId = table.Column<int>(type: "INTEGER", nullable: false),
                    BookGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Book_BookToBookGenre", x => x.BookToBookGenreId);
                    table.ForeignKey(
                        name: "FK_BookToBookGenre_BookGenre_BookGenreId",
                        column: x => x.BookGenreId,
                        principalSchema: "book",
                        principalTable: "BookGenre",
                        principalColumn: "BookGenreId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookToBookGenre_Book_BookId",
                        column: x => x.BookId,
                        principalSchema: "book",
                        principalTable: "Book",
                        principalColumn: "BookId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MovieToMovieGenre",
                schema: "movie",
                columns: table => new
                {
                    MovieToMovieGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MovieId = table.Column<int>(type: "INTEGER", nullable: false),
                    MovieGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movie_MovieToMovieGenre", x => x.MovieToMovieGenreId);
                    table.ForeignKey(
                        name: "FK_MovieToMovieGenre_MovieGenre_MovieGenreId",
                        column: x => x.MovieGenreId,
                        principalSchema: "movie",
                        principalTable: "MovieGenre",
                        principalColumn: "MovieGenreId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MovieToMovieGenre_Movie_MovieId",
                        column: x => x.MovieId,
                        principalSchema: "movie",
                        principalTable: "Movie",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TelevisionShowToTelevisionGenre",
                schema: "tv",
                columns: table => new
                {
                    TelevisionShowToTelevisionGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TelevisionShowId = table.Column<int>(type: "INTEGER", nullable: false),
                    TelevisionGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tv_TelevisionShowToTelevisionGenre", x => x.TelevisionShowToTelevisionGenreId);
                    table.ForeignKey(
                        name: "FK_TelevisionShowToTelevisionGenre_TelevisionGenre_TelevisionGenreId",
                        column: x => x.TelevisionGenreId,
                        principalSchema: "tv",
                        principalTable: "TelevisionGenre",
                        principalColumn: "TelevisionGenreId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TelevisionShowToTelevisionGenre_TelevisionShow_TelevisionShowId",
                        column: x => x.TelevisionShowId,
                        principalSchema: "tv",
                        principalTable: "TelevisionShow",
                        principalColumn: "TelevisionShowId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TelevisionShowToTelevisionService",
                schema: "tv",
                columns: table => new
                {
                    TelevisionShowToTelevisionServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TelevisionShowId = table.Column<int>(type: "INTEGER", nullable: false),
                    TelevisionServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tv_TelevisionShowToTelevisionService", x => x.TelevisionShowToTelevisionServiceId);
                    table.ForeignKey(
                        name: "FK_TelevisionShowToTelevisionService_TelevisionService_TelevisionServiceId",
                        column: x => x.TelevisionServiceId,
                        principalSchema: "tv",
                        principalTable: "TelevisionService",
                        principalColumn: "TelevisionServiceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TelevisionShowToTelevisionService_TelevisionShow_TelevisionShowId",
                        column: x => x.TelevisionShowId,
                        principalSchema: "tv",
                        principalTable: "TelevisionShow",
                        principalColumn: "TelevisionShowId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VideoGameToVideoGameGenre",
                schema: "videogame",
                columns: table => new
                {
                    VideoGameToVideoGameGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VideoGameId = table.Column<int>(type: "INTEGER", nullable: false),
                    VideoGameGenreId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videogame_VideoGameToVideoGameGenre", x => x.VideoGameToVideoGameGenreId);
                    table.ForeignKey(
                        name: "FK_VideoGameToVideoGameGenre_VideoGameGenre_VideoGameGenreId",
                        column: x => x.VideoGameGenreId,
                        principalSchema: "videogame",
                        principalTable: "VideoGameGenre",
                        principalColumn: "VideoGameGenreId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VideoGameToVideoGameGenre_VideoGame_VideoGameId",
                        column: x => x.VideoGameId,
                        principalSchema: "videogame",
                        principalTable: "VideoGame",
                        principalColumn: "VideoGameId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VideoGameToVideoGameSystem",
                schema: "videogame",
                columns: table => new
                {
                    VideoGameToVideoGameSystemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VideoGameId = table.Column<int>(type: "INTEGER", nullable: false),
                    VideoGameSystemId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videogame_VideoGameToVideoGameSystem", x => x.VideoGameToVideoGameSystemId);
                    table.ForeignKey(
                        name: "FK_VideoGameToVideoGameSystem_VideoGameSystem_VideoGameSystemId",
                        column: x => x.VideoGameSystemId,
                        principalSchema: "videogame",
                        principalTable: "VideoGameSystem",
                        principalColumn: "VideoGameSystemId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VideoGameToVideoGameSystem_VideoGame_VideoGameId",
                        column: x => x.VideoGameId,
                        principalSchema: "videogame",
                        principalTable: "VideoGame",
                        principalColumn: "VideoGameId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookSeriesId",
                schema: "book",
                table: "Book",
                column: "BookSeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookStatusId",
                schema: "book",
                table: "Book",
                column: "BookStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookTypeId",
                schema: "book",
                table: "Book",
                column: "BookTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_BookToBookFormat_BookFormatId",
                schema: "book",
                table: "BookToBookFormat",
                column: "BookFormatId");

            migrationBuilder.CreateIndex(
                name: "UQ_Book_BookToBookFormat_BookId_BookFormatId",
                schema: "book",
                table: "BookToBookFormat",
                columns: new[] { "BookId", "BookFormatId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookToBookGenre_BookGenreId",
                schema: "book",
                table: "BookToBookGenre",
                column: "BookGenreId");

            migrationBuilder.CreateIndex(
                name: "UQ_Book_BookToBookGenre_BookId_BookGenreId",
                schema: "book",
                table: "BookToBookGenre",
                columns: new[] { "BookId", "BookGenreId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Link_LinkCategoryId",
                schema: "link",
                table: "Link",
                column: "LinkCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Link_LinkTypeId",
                schema: "link",
                table: "Link",
                column: "LinkTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Movie_MovieStatusId",
                schema: "movie",
                table: "Movie",
                column: "MovieStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieToMovieGenre_MovieGenreId",
                schema: "movie",
                table: "MovieToMovieGenre",
                column: "MovieGenreId");

            migrationBuilder.CreateIndex(
                name: "UQ_Movie_MovieToMovieGenre_MovieId_MovieGenreId",
                schema: "movie",
                table: "MovieToMovieGenre",
                columns: new[] { "MovieId", "MovieGenreId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MusicAlbumToMusicFormat_MusicFormatId",
                schema: "music",
                table: "MusicAlbumToMusicFormat",
                column: "MusicFormatId");

            migrationBuilder.CreateIndex(
                name: "UQ_Music_MusicAlbumToMusicFormat_MusicAlbumId_MusicFormatId",
                schema: "music",
                table: "MusicAlbumToMusicFormat",
                columns: new[] { "MusicAlbumId", "MusicFormatId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MusicAlbumToMusicGenre_MusicGenreId",
                schema: "music",
                table: "MusicAlbumToMusicGenre",
                column: "MusicGenreId");

            migrationBuilder.CreateIndex(
                name: "UQ_Music_MusicAlbumToMusicGenre_MusicAlbumId_MusicGenreId",
                schema: "music",
                table: "MusicAlbumToMusicGenre",
                columns: new[] { "MusicAlbumId", "MusicGenreId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MusicAlbumTrack_MusicAlbumId",
                schema: "music",
                table: "MusicAlbumTrack",
                column: "MusicAlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_Podcast_PodcastCategoryId",
                schema: "podcast",
                table: "Podcast",
                column: "PodcastCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TelevisionShow_TelevisionStatusId",
                schema: "tv",
                table: "TelevisionShow",
                column: "TelevisionStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_TelevisionShowToTelevisionGenre_TelevisionGenreId",
                schema: "tv",
                table: "TelevisionShowToTelevisionGenre",
                column: "TelevisionGenreId");

            migrationBuilder.CreateIndex(
                name: "UQ_Tv_TelevisionShowToTelevisionGenre_TelevisionShowId_TelevisionGenreId",
                schema: "tv",
                table: "TelevisionShowToTelevisionGenre",
                columns: new[] { "TelevisionShowId", "TelevisionGenreId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TelevisionShowToTelevisionService_TelevisionServiceId",
                schema: "tv",
                table: "TelevisionShowToTelevisionService",
                column: "TelevisionServiceId");

            migrationBuilder.CreateIndex(
                name: "UQ_Music_TelevisionShowToTelevisionService_TelevisionShowId_TelevisionServiceId",
                schema: "tv",
                table: "TelevisionShowToTelevisionService",
                columns: new[] { "TelevisionShowId", "TelevisionServiceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VideoGame_VideoGameCompletionId",
                schema: "videogame",
                table: "VideoGame",
                column: "VideoGameCompletionId");

            migrationBuilder.CreateIndex(
                name: "IX_VideoGame_VideoGameStatusId",
                schema: "videogame",
                table: "VideoGame",
                column: "VideoGameStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_VideoGameToVideoGameGenre_VideoGameGenreId",
                schema: "videogame",
                table: "VideoGameToVideoGameGenre",
                column: "VideoGameGenreId");

            migrationBuilder.CreateIndex(
                name: "UQ_Videogame_VideoGameToVideoGameGenre_VideoGameId_VideoGameGenreId",
                schema: "videogame",
                table: "VideoGameToVideoGameGenre",
                columns: new[] { "VideoGameId", "VideoGameGenreId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VideoGameToVideoGameSystem_VideoGameSystemId",
                schema: "videogame",
                table: "VideoGameToVideoGameSystem",
                column: "VideoGameSystemId");

            migrationBuilder.CreateIndex(
                name: "UQ_Videogame_VideoGameToVideoGameSystem_VideoGameId_VideoGameSystemId",
                schema: "videogame",
                table: "VideoGameToVideoGameSystem",
                columns: new[] { "VideoGameId", "VideoGameSystemId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookToBookFormat",
                schema: "book");

            migrationBuilder.DropTable(
                name: "BookToBookGenre",
                schema: "book");

            migrationBuilder.DropTable(
                name: "Link",
                schema: "link");

            migrationBuilder.DropTable(
                name: "MovieToMovieGenre",
                schema: "movie");

            migrationBuilder.DropTable(
                name: "MusicAlbumToMusicFormat",
                schema: "music");

            migrationBuilder.DropTable(
                name: "MusicAlbumToMusicGenre",
                schema: "music");

            migrationBuilder.DropTable(
                name: "MusicAlbumTrack",
                schema: "music");

            migrationBuilder.DropTable(
                name: "Podcast",
                schema: "podcast");

            migrationBuilder.DropTable(
                name: "TelevisionShowToTelevisionGenre",
                schema: "tv");

            migrationBuilder.DropTable(
                name: "TelevisionShowToTelevisionService",
                schema: "tv");

            migrationBuilder.DropTable(
                name: "VideoGameToVideoGameGenre",
                schema: "videogame");

            migrationBuilder.DropTable(
                name: "VideoGameToVideoGameSystem",
                schema: "videogame");

            migrationBuilder.DropTable(
                name: "BookFormat",
                schema: "book");

            migrationBuilder.DropTable(
                name: "BookGenre",
                schema: "book");

            migrationBuilder.DropTable(
                name: "Book",
                schema: "book");

            migrationBuilder.DropTable(
                name: "LinkCategory",
                schema: "link");

            migrationBuilder.DropTable(
                name: "LinkType",
                schema: "link");

            migrationBuilder.DropTable(
                name: "MovieGenre",
                schema: "movie");

            migrationBuilder.DropTable(
                name: "Movie",
                schema: "movie");

            migrationBuilder.DropTable(
                name: "MusicFormat",
                schema: "music");

            migrationBuilder.DropTable(
                name: "MusicGenre",
                schema: "music");

            migrationBuilder.DropTable(
                name: "MusicAlbum",
                schema: "music");

            migrationBuilder.DropTable(
                name: "PodcastCategory",
                schema: "podcast");

            migrationBuilder.DropTable(
                name: "TelevisionGenre",
                schema: "tv");

            migrationBuilder.DropTable(
                name: "TelevisionService",
                schema: "tv");

            migrationBuilder.DropTable(
                name: "TelevisionShow",
                schema: "tv");

            migrationBuilder.DropTable(
                name: "VideoGameGenre",
                schema: "videogame");

            migrationBuilder.DropTable(
                name: "VideoGameSystem",
                schema: "videogame");

            migrationBuilder.DropTable(
                name: "VideoGame",
                schema: "videogame");

            migrationBuilder.DropTable(
                name: "BookSeries",
                schema: "book");

            migrationBuilder.DropTable(
                name: "BookStatus",
                schema: "book");

            migrationBuilder.DropTable(
                name: "BookType",
                schema: "book");

            migrationBuilder.DropTable(
                name: "MovieStatus",
                schema: "movie");

            migrationBuilder.DropTable(
                name: "TelevisionStatus",
                schema: "tv");

            migrationBuilder.DropTable(
                name: "VideoGameCompletion",
                schema: "videogame");

            migrationBuilder.DropTable(
                name: "VideoGameStatus",
                schema: "videogame");
        }
    }
}
