CREATE TABLE "BookStatus" (
	"BookStatusId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"ColorCode"	TEXT NOT NULL DEFAULT '',
	CONSTRAINT "PK_Book_BookStatus" PRIMARY KEY("BookStatusId" AUTOINCREMENT)
);

CREATE TABLE "BookSeries" (
    "BookSeriesId" INTEGER NOT NULL CONSTRAINT "PK_Book_BookSeries" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "BookFormat" (
    "BookFormatId" INTEGER NOT NULL CONSTRAINT "PK_Book_BookFormat" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "BookGenre" (
    "BookGenreId" INTEGER NOT NULL CONSTRAINT "PK_Book_BookGenre" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "Book" (
    "BookId" INTEGER NOT NULL CONSTRAINT "PK_Book_Book" PRIMARY KEY AUTOINCREMENT,
    "BookStatusId" INTEGER NOT NULL,
    "BookTypeId" INTEGER NOT NULL,
    "BookSeriesId" INTEGER NULL,
    "Title" TEXT NOT NULL DEFAULT '',
    "SubTitle" TEXT NOT NULL,
    "Author" TEXT NOT NULL,
    "Link" TEXT NOT NULL,
    "DateStarted" TEXT NULL,
    "DateCompleted" TEXT NULL,
    "Rating" INTEGER NOT NULL DEFAULT 0,
    "BookNotesUrl" TEXT NOT NULL DEFAULT '',
    "Thoughts" TEXT NOT NULL DEFAULT '',
    "CoverImageUrl" TEXT NOT NULL,
    "IsAtLibrary" INTEGER NOT NULL DEFAULT 0,
    "CurrentPage" INTEGER NOT NULL DEFAULT 1,
    "PageCount" INTEGER NOT NULL,
    "SortOrder" INTEGER NULL, "IsPurchased" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "FK_Book_BookSeries_BookSeriesId" FOREIGN KEY ("BookSeriesId") REFERENCES "BookSeries" ("BookSeriesId"),
    CONSTRAINT "FK_Book_BookStatus_BookStatusId" FOREIGN KEY ("BookStatusId") REFERENCES "BookStatus" ("BookStatusId") ON DELETE CASCADE,
    CONSTRAINT "FK_Book_BookType_BookTypeId" FOREIGN KEY ("BookTypeId") REFERENCES "BookType" ("BookTypeId") ON DELETE CASCADE
);

CREATE TABLE "BookToBookFormat" (
    "BookToBookFormatId" INTEGER NOT NULL CONSTRAINT "PK_Book_BookToBookFormat" PRIMARY KEY AUTOINCREMENT,
    "BookId" INTEGER NOT NULL,
    "BookFormatId" INTEGER NOT NULL,
    CONSTRAINT "FK_BookToBookFormat_BookFormat_BookFormatId" FOREIGN KEY ("BookFormatId") REFERENCES "BookFormat" ("BookFormatId") ON DELETE RESTRICT,
    CONSTRAINT "FK_BookToBookFormat_Book_BookId" FOREIGN KEY ("BookId") REFERENCES "Book" ("BookId") ON DELETE RESTRICT
);

CREATE TABLE "BookToBookGenre" (
    "BookToBookGenreId" INTEGER NOT NULL CONSTRAINT "PK_Book_BookToBookGenre" PRIMARY KEY AUTOINCREMENT,
    "BookId" INTEGER NOT NULL,
    "BookGenreId" INTEGER NOT NULL,
    CONSTRAINT "FK_BookToBookGenre_BookGenre_BookGenreId" FOREIGN KEY ("BookGenreId") REFERENCES "BookGenre" ("BookGenreId") ON DELETE RESTRICT,
    CONSTRAINT "FK_BookToBookGenre_Book_BookId" FOREIGN KEY ("BookId") REFERENCES "Book" ("BookId") ON DELETE RESTRICT
);

CREATE TABLE "LinkType" (
    "LinkTypeId" INTEGER NOT NULL CONSTRAINT "PK_Link_LinkType" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "LinkCategory" (
    "LinkCategoryId" INTEGER NOT NULL CONSTRAINT "PK_Link_LinkCategory" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "Link" (
    "LinkId" INTEGER NOT NULL CONSTRAINT "PK_Link_Link" PRIMARY KEY AUTOINCREMENT,
    "LinkTypeId" INTEGER NOT NULL,
    "LinkCategoryId" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Url" TEXT NOT NULL,
    "Author" TEXT NOT NULL,
    "LinkDate" TEXT NOT NULL,
    "ReadingLogIssueNumber" INTEGER NOT NULL,
    CONSTRAINT "FK_Link_LinkCategory_LinkCategoryId" FOREIGN KEY ("LinkCategoryId") REFERENCES "LinkCategory" ("LinkCategoryId") ON DELETE CASCADE,
    CONSTRAINT "FK_Link_LinkType_LinkTypeId" FOREIGN KEY ("LinkTypeId") REFERENCES "LinkType" ("LinkTypeId") ON DELETE CASCADE
);

CREATE TABLE "VideoGenre" (
	"VideoGenreId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"ColorCode"	TEXT NOT NULL DEFAULT '',
	CONSTRAINT "PK_VideoGenre" PRIMARY KEY("VideoGenreId" AUTOINCREMENT)
);

CREATE TABLE "VideoService" (
	"VideoServiceId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"ColorCode"	TEXT NOT NULL DEFAULT '',
	CONSTRAINT "PK_VideoService" PRIMARY KEY("VideoServiceId" AUTOINCREMENT)
);

CREATE TABLE "MovieStatus" (
    "MovieStatusId" INTEGER NOT NULL CONSTRAINT "PK_Movie_MovieStatus" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "Movie" (
    "MovieId" INTEGER NOT NULL CONSTRAINT "PK_Movie_Movie" PRIMARY KEY AUTOINCREMENT,
    "DateWatched" TEXT NULL,
    "ImdbLink" TEXT NOT NULL,
    "MovieStatusId" INTEGER NOT NULL,
    "PosterImageUrl" TEXT NOT NULL,
    "Rating" INTEGER NOT NULL DEFAULT 0,
    "Thoughts" TEXT NOT NULL DEFAULT '',
    "Title" TEXT NOT NULL, "SortOrder" INTEGER NULL,
    CONSTRAINT "FK_Movie_MovieStatus_MovieStatusId" FOREIGN KEY ("MovieStatusId") REFERENCES "MovieStatus" ("MovieStatusId") ON DELETE CASCADE
);

CREATE TABLE "MovieToVideoGenre" (
	"MovieToVideoGenreId"	INTEGER NOT NULL,
	"MovieId"	INTEGER NOT NULL,
	"VideoGenreId"	INTEGER NOT NULL,
	CONSTRAINT "PK_MovieToVideoGenre" PRIMARY KEY("MovieToVideoGenreId" AUTOINCREMENT),
	CONSTRAINT "FK_MovieToVideoGenre_VideoGenreId" FOREIGN KEY("VideoGenreId") REFERENCES "VideoGenre"("VideoGenreId") ON DELETE RESTRICT,
	CONSTRAINT "FK_MovieToVideoGenreMovieId" FOREIGN KEY("MovieId") REFERENCES "Movie"("MovieId") ON DELETE RESTRICT
);

CREATE TABLE "MovieToVideoService" (
	"MovieToVideoServiceId"	INTEGER NOT NULL,
	"MovieId"	INTEGER NOT NULL,
	"VideoServiceId"	INTEGER NOT NULL,
	CONSTRAINT "PK_MovieToVideoService" PRIMARY KEY("MovieToVideoServiceId" AUTOINCREMENT),
	CONSTRAINT "FK_MovieToVideoService_VideoServiceId" FOREIGN KEY("VideoServiceId") REFERENCES "VideoService"("VideoServiceId") ON DELETE RESTRICT,
	CONSTRAINT "FK_MovieToVideoService_MovieId" FOREIGN KEY("MovieId") REFERENCES "Movie"("MovieId") ON DELETE RESTRICT
);

CREATE TABLE "MusicFormat" (
    "MusicFormatId" INTEGER NOT NULL CONSTRAINT "PK_Music_MusicFormat" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "MusicGenre" (
    "MusicGenreId" INTEGER NOT NULL CONSTRAINT "PK_Music_Genre" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "MusicAlbum" (
    "MusicAlbumId" INTEGER NOT NULL CONSTRAINT "PK_Music_MusicAlbum" PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Artist" TEXT NOT NULL,
    "Thoughts" TEXT NOT NULL DEFAULT '',
    "CoverImageUrl" TEXT NOT NULL,
    "IsTopTen" INTEGER NOT NULL DEFAULT 0,
    "ShowOnNowPage" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "MusicAlbumToMusicFormat" (
    "MusicAlbumToMusicFormatId" INTEGER NOT NULL CONSTRAINT "PK_Music_MusicAlbumToMusicFormat" PRIMARY KEY AUTOINCREMENT,
    "MusicAlbumId" INTEGER NOT NULL,
    "MusicFormatId" INTEGER NOT NULL,
    CONSTRAINT "FK_MusicAlbumToMusicFormat_MusicAlbum_MusicAlbumId" FOREIGN KEY ("MusicAlbumId") REFERENCES "MusicAlbum" ("MusicAlbumId") ON DELETE RESTRICT,
    CONSTRAINT "FK_MusicAlbumToMusicFormat_MusicFormat_MusicFormatId" FOREIGN KEY ("MusicFormatId") REFERENCES "MusicFormat" ("MusicFormatId") ON DELETE RESTRICT
);

CREATE TABLE "MusicAlbumToMusicGenre" (
    "MusicAlbumToMusicGenreId" INTEGER NOT NULL CONSTRAINT "PK_Music_MusicAlbumToMusicGenre" PRIMARY KEY AUTOINCREMENT,
    "MusicAlbumId" INTEGER NOT NULL,
    "MusicGenreId" INTEGER NOT NULL,
    CONSTRAINT "FK_MusicAlbumToMusicGenre_MusicAlbum_MusicAlbumId" FOREIGN KEY ("MusicAlbumId") REFERENCES "MusicAlbum" ("MusicAlbumId") ON DELETE RESTRICT,
    CONSTRAINT "FK_MusicAlbumToMusicGenre_MusicGenre_MusicGenreId" FOREIGN KEY ("MusicGenreId") REFERENCES "MusicGenre" ("MusicGenreId") ON DELETE RESTRICT
);

CREATE TABLE "MusicAlbumTrack" (
    "MusicAlbumTrackId" INTEGER NOT NULL CONSTRAINT "PK_Music_MusicAlbumTrack" PRIMARY KEY AUTOINCREMENT,
    "MusicAlbumId" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "TrackNumber" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "FK_MusicAlbumTrack_MusicAlbum_MusicAlbumId" FOREIGN KEY ("MusicAlbumId") REFERENCES "MusicAlbum" ("MusicAlbumId") ON DELETE CASCADE
);

CREATE TABLE "PodcastCategory" (
	"PodcastCategoryId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"ColorCode"	TEXT NOT NULL DEFAULT '',
	CONSTRAINT "PK_Podcast_PodcastCategory" PRIMARY KEY("PodcastCategoryId" AUTOINCREMENT)
);

CREATE TABLE "Podcast" (
    "PodcastId" INTEGER NOT NULL CONSTRAINT "PK_Podcast_Podcast" PRIMARY KEY AUTOINCREMENT,
    "CoverImageUrl" TEXT NOT NULL,
    "Link" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "PodcastCategoryId" INTEGER NOT NULL,
    CONSTRAINT "FK_Podcast_PodcastCategory_PodcastCategoryId" FOREIGN KEY ("PodcastCategoryId") REFERENCES "PodcastCategory" ("PodcastCategoryId") ON DELETE CASCADE
);

CREATE TABLE "TelevisionStatus" (
    "TelevisionStatusId" INTEGER NOT NULL CONSTRAINT "PK_Tv_TelevisionStatus" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "TelevisionShow" (
	"TelevisionShowId"	INTEGER NOT NULL,
	"TelevisionStatusId"	INTEGER NOT NULL,
	"Title"	TEXT NOT NULL,
	"ImdbLink"	TEXT NOT NULL,
	"Rating"	INTEGER NOT NULL DEFAULT 0,
	"Thoughts"	TEXT NOT NULL DEFAULT '',
	"CoverImageUrl"	TEXT NOT NULL,
	"CurrentSeasonEpisode"	INTEGER NOT NULL DEFAULT 0,
	"SeasonEpisodeCount"	INTEGER NOT NULL DEFAULT 0,
	"SortOrder"	INTEGER,
	CONSTRAINT "PK_Tv_TelevisionShow" PRIMARY KEY("TelevisionShowId" AUTOINCREMENT),
	CONSTRAINT "FK_TelevisionShow_TelevisionStatus_TelevisionStatusId" FOREIGN KEY("TelevisionStatusId") REFERENCES "TelevisionStatus"("TelevisionStatusId") ON DELETE CASCADE
);

CREATE TABLE "TelevisionShowToVideoGenre" (
	"TelevisionShowToVideoGenreId"	INTEGER NOT NULL,
	"TelevisionShowId"	INTEGER NOT NULL,
	"VideoGenreId"	INTEGER NOT NULL,
	CONSTRAINT "PK_TelevisionShowToVideoGenre" PRIMARY KEY("TelevisionShowToVideoGenreId" AUTOINCREMENT),
	CONSTRAINT "FK_TelevisionShowToVideoGenre_VideoGenreId" FOREIGN KEY("VideoGenreId") REFERENCES "VideoGenre"("VideoGenreId") ON DELETE RESTRICT,
	CONSTRAINT "FK_TelevisionShowToVideoGenre_TelevisionShowId" FOREIGN KEY("TelevisionShowId") REFERENCES "TelevisionShow"("TelevisionShowId") ON DELETE RESTRICT
);

CREATE TABLE "TelevisionShowToVideoService" (
	"TelevisionShowToVideoServiceId"	INTEGER NOT NULL,
	"TelevisionShowId"	INTEGER NOT NULL,
	"VideoServiceId"	INTEGER NOT NULL,
	CONSTRAINT "PK_TelevisionShowToVideoService" PRIMARY KEY("TelevisionShowToVideoServiceId" AUTOINCREMENT),
	CONSTRAINT "FK_TelevisionShowToVideoService_TelevisionShowId" FOREIGN KEY("TelevisionShowId") REFERENCES "TelevisionShow"("TelevisionShowId") ON DELETE RESTRICT,
	CONSTRAINT "FK_TelevisionShowToVideoService_VideoServiceId" FOREIGN KEY("VideoServiceId") REFERENCES "VideoService"("VideoServiceId") ON DELETE RESTRICT
);

CREATE TABLE "VideoGameCompletion" (
    "VideoGameCompletionId" INTEGER NOT NULL CONSTRAINT "PK_Videogame_VideoGameCompletion" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "VideoGameGenre" (
    "VideoGameGenreId" INTEGER NOT NULL CONSTRAINT "PK_Videogame_VideoGameGenre" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "VideoGameStatus" (
    "VideoGameStatusId" INTEGER NOT NULL CONSTRAINT "PK_Videogame_VideoGameStatus" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "VideoGameSystem" (
    "VideoGameSystemId" INTEGER NOT NULL CONSTRAINT "PK_Videogame_VideoGameSystem" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ColorCode" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "VideoGame" (
    "VideoGameId" INTEGER NOT NULL CONSTRAINT "PK_Videogame_VideoGme" PRIMARY KEY AUTOINCREMENT,
    "VideoGameStatusId" INTEGER NOT NULL,
    "VideoGameCompletionId" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Link" TEXT NOT NULL,
    "DateStarted" TEXT NULL,
    "DateCompleted" TEXT NULL,
    "Rating" INTEGER NOT NULL DEFAULT 0,
    "Thoughts" TEXT NOT NULL DEFAULT '',
    "CoverImageUrl" TEXT NOT NULL,
    "SortOrder" INTEGER NULL,
    CONSTRAINT "FK_VideoGame_VideoGameCompletion_VideoGameCompletionId" FOREIGN KEY ("VideoGameCompletionId") REFERENCES "VideoGameCompletion" ("VideoGameCompletionId") ON DELETE CASCADE,
    CONSTRAINT "FK_VideoGame_VideoGameStatus_VideoGameStatusId" FOREIGN KEY ("VideoGameStatusId") REFERENCES "VideoGameStatus" ("VideoGameStatusId") ON DELETE CASCADE
);

CREATE TABLE "VideoGameToVideoGameGenre" (
    "VideoGameToVideoGameGenreId" INTEGER NOT NULL CONSTRAINT "PK_Videogame_VideoGameToVideoGameGenre" PRIMARY KEY AUTOINCREMENT,
    "VideoGameId" INTEGER NOT NULL,
    "VideoGameGenreId" INTEGER NOT NULL,
    CONSTRAINT "FK_VideoGameToVideoGameGenre_VideoGameGenre_VideoGameGenreId" FOREIGN KEY ("VideoGameGenreId") REFERENCES "VideoGameGenre" ("VideoGameGenreId") ON DELETE RESTRICT,
    CONSTRAINT "FK_VideoGameToVideoGameGenre_VideoGame_VideoGameId" FOREIGN KEY ("VideoGameId") REFERENCES "VideoGame" ("VideoGameId") ON DELETE RESTRICT
);

CREATE TABLE "VideoGameToVideoGameSystem" (
    "VideoGameToVideoGameSystemId" INTEGER NOT NULL CONSTRAINT "PK_Videogame_VideoGameToVideoGameSystem" PRIMARY KEY AUTOINCREMENT,
    "VideoGameId" INTEGER NOT NULL,
    "VideoGameSystemId" INTEGER NOT NULL,
    CONSTRAINT "FK_VideoGameToVideoGameSystem_VideoGameSystem_VideoGameSystemId" FOREIGN KEY ("VideoGameSystemId") REFERENCES "VideoGameSystem" ("VideoGameSystemId") ON DELETE RESTRICT,
    CONSTRAINT "FK_VideoGameToVideoGameSystem_VideoGame_VideoGameId" FOREIGN KEY ("VideoGameId") REFERENCES "VideoGame" ("VideoGameId") ON DELETE RESTRICT
);

-- INDICIES

CREATE INDEX "IX_BookToBookFormat_BookFormatId" ON "BookToBookFormat" ("BookFormatId");
CREATE INDEX "IX_BookToBookGenre_BookGenreId" ON "BookToBookGenre" ("BookGenreId");
CREATE INDEX "IX_Book_BookSeriesId" ON "Book" ("BookSeriesId");
CREATE INDEX "IX_Book_BookStatusId" ON "Book" ("BookStatusId");
CREATE INDEX "IX_Book_BookTypeId" ON "Book" ("BookTypeId");
CREATE INDEX "IX_Link_LinkCategoryId" ON "Link" ("LinkCategoryId");
CREATE INDEX "IX_Link_LinkTypeId" ON "Link" ("LinkTypeId");
CREATE INDEX "IX_Movie_MovieStatusId" ON "Movie" ("MovieStatusId");
CREATE INDEX "IX_MusicAlbumToMusicFormat_MusicFormatId" ON "MusicAlbumToMusicFormat" ("MusicFormatId");
CREATE INDEX "IX_MusicAlbumToMusicGenre_MusicGenreId" ON "MusicAlbumToMusicGenre" ("MusicGenreId");
CREATE INDEX "IX_MusicAlbumTrack_MusicAlbumId" ON "MusicAlbumTrack" ("MusicAlbumId");
CREATE INDEX "IX_Podcast_PodcastCategoryId" ON "Podcast" ("PodcastCategoryId");
CREATE INDEX "IX_TelevisionShow_TelevisionStatusId" ON "TelevisionShow" ("TelevisionStatusId");
CREATE INDEX "IX_VideoGameToVideoGameGenre_VideoGameGenreId" ON "VideoGameToVideoGameGenre" ("VideoGameGenreId");
CREATE INDEX "IX_VideoGameToVideoGameSystem_VideoGameSystemId" ON "VideoGameToVideoGameSystem" ("VideoGameSystemId");
CREATE INDEX "IX_VideoGame_VideoGameCompletionId" ON "VideoGame" ("VideoGameCompletionId");
CREATE INDEX "IX_VideoGame_VideoGameStatusId" ON "VideoGame" ("VideoGameStatusId");
CREATE UNIQUE INDEX "UQ_Book_BookToBookFormat_BookId_BookFormatId" ON "BookToBookFormat" ("BookId", "BookFormatId");
CREATE UNIQUE INDEX "UQ_Book_BookToBookGenre_BookId_BookGenreId" ON "BookToBookGenre" ("BookId", "BookGenreId");
CREATE UNIQUE INDEX "UQ_Music_MusicAlbumToMusicFormat_MusicAlbumId_MusicFormatId" ON "MusicAlbumToMusicFormat" ("MusicAlbumId", "MusicFormatId");
CREATE UNIQUE INDEX "UQ_Music_MusicAlbumToMusicGenre_MusicAlbumId_MusicGenreId" ON "MusicAlbumToMusicGenre" ("MusicAlbumId", "MusicGenreId");
CREATE UNIQUE INDEX "UQ_Videogame_VideoGameToVideoGameGenre_VideoGameId_VideoGameGenreId" ON "VideoGameToVideoGameGenre" ("VideoGameId", "VideoGameGenreId");
CREATE UNIQUE INDEX "UQ_Videogame_VideoGameToVideoGameSystem_VideoGameId_VideoGameSystemId" ON "VideoGameToVideoGameSystem" ("VideoGameId", "VideoGameSystemId");

-- REFERENCE DATA

-- BookStatus
INSERT INTO BookStatus (BookStatusId, Name, ColorCode) VALUES (1, 'To Read', '#313ca2');
INSERT INTO BookStatus (BookStatusId, Name, ColorCode) VALUES (2, 'Reading', '#6a208f');
INSERT INTO BookStatus (BookStatusId, Name, ColorCode) VALUES (3, 'Finished', '#0e6532');
INSERT INTO BookStatus (BookStatusId, Name, ColorCode) VALUES (4, 'Abandoned', '#791b1e');

-- BookFormat
INSERT INTO BookFormat (BookFormatId, Name, ColorCode) VALUES (1, 'Hardcover', '#a0175f');
INSERT INTO BookFormat (BookFormatId, Name, ColorCode) VALUES (2, 'Paperback', '#cd6a29');
INSERT INTO BookFormat (BookFormatId, Name, ColorCode) VALUES (3, 'eBook', '#2c5813');

-- LinkType
INSERT INTO LinkType (LinkTypeId, Name, ColorCode) VALUES (1, 'Link', '#009b8f');
INSERT INTO LinkType (LinkTypeId, Name, ColorCode) VALUES (2, 'Podcast', '#5725a0');
INSERT INTO LinkType (LinkTypeId, Name, ColorCode) VALUES (3, 'Video', '#a53621');

-- LinkCategory
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (1, '.NET', '#5725a0');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (2, 'Business & Finance', '#0d5430');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (3, 'Climate', '#9a702d');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (4, 'Everything Else', '#921e14');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (5, 'Gaming', '#275576');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (6, 'General Development', '#4a468a');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (7, 'Health & Fitness', '#871c4a');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (8, 'Journalism', '#131519');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (9, 'Media & Entertainment', '#7949a8');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (10, 'Podcasts', '#239f5b');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (11, 'Politics', '#8b642f');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (12, 'Science', '#732a45');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (13, 'Space', '#2c0d18');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (14, 'Sports', '#2d5f6f');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (15, 'Technology', '#273fd2');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (16, 'The Internet', '#8b3d15');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (17, 'Web Development', '#27681b');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (19, 'Design', '#0b545e');
INSERT INTO LinkCategory (LinkCategoryId, Name, ColorCode) VALUES (20, 'Longform', '#571693');

-- MovieStatus
INSERT INTO MovieStatus( MovieStatusId, Name, ColorCode) VALUES (1, 'Personal To Watch', '#0a8db9');
INSERT INTO MovieStatus( MovieStatusId, Name, ColorCode) VALUES (2, 'Joint To Watch', '#7f328e');
INSERT INTO MovieStatus( MovieStatusId, Name, ColorCode) VALUES (3, 'Watched', '#2a9a39');
INSERT INTO MovieStatus( MovieStatusId, Name, ColorCode) VALUES (4, "Couldn't Finish", '#ee152f');

-- MusicFormat
INSERT INTO MusicFormat (MusicFormatId, Name, ColorCode) VALUES (1, 'CD', '#106869');
INSERT INTO MusicFormat (MusicFormatId, Name, ColorCode) VALUES (2, 'Digital', 'rgb(102, 59, 177)');
INSERT INTO MusicFormat (MusicFormatId, Name, ColorCode) VALUES (3, 'Vinyl', '#a51643');

-- PodcastCategory
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (1, 'Business & Economics', '#017c34');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (2, 'Food', '#3b6b94');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (3, 'Gaming', '#9e0db8');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (4, 'Health & Fitness', '#975306');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (5, 'History', '#213aae');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (6, 'News', '#584927');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (7, 'Finance & Investing', '#08260e');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (8, 'Politics', '#2c6059');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (9, 'Science', '#4f5d27');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (10, 'Software Development', '#9b1d35');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (11, 'Sports', '#4d4983');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (12, 'Stories', '#cf5d29');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (13, 'Tech & Design', '#c46640');
INSERT INTO PodcastCategory (PodcastCategoryId, Name, ColorCode) VALUES (14, 'Uncategorized', '#de3a80');

-- TelevisionStatus
INSERT INTO TelevisionStatus (TelevisionStatusId, Name, ColorCode) VALUES (1, 'Personal To-Watch', '#5a5611');
INSERT INTO TelevisionStatus (TelevisionStatusId, Name, ColorCode) VALUES (2, 'Joint To-Watch', '#803e13');
INSERT INTO TelevisionStatus (TelevisionStatusId, Name, ColorCode) VALUES (3, 'Watching', '#005c78');
INSERT INTO TelevisionStatus (TelevisionStatusId, Name, ColorCode) VALUES (4, 'In Between Seasons', '#901960');
INSERT INTO TelevisionStatus (TelevisionStatusId, Name, ColorCode) VALUES (5, 'Watched', '#343aa8');
INSERT INTO TelevisionStatus (TelevisionStatusId, Name, ColorCode) VALUES (6, "Couldn't Finish", '#175853');

-- VideoGameCompletion
INSERT INTO VideoGameCompletion (VideoGameCompletionId, Name, ColorCode) VALUES (1, 'N/A', '#144d72');
INSERT INTO VideoGameCompletion (VideoGameCompletionId, Name, ColorCode) VALUES (2, 'Yes', '#469838');
INSERT INTO VideoGameCompletion (VideoGameCompletionId, Name, ColorCode) VALUES (3, 'No', '#790714');

-- VideoGameStatus
INSERT INTO VideoGameStatus (VideoGameStatusId, Name, ColorCode) VALUES (1, 'To Play', '#243391');
INSERT INTO VideoGameStatus (VideoGameStatusId, Name, ColorCode) VALUES (2, 'In Progress', '#d76c28');
INSERT INTO VideoGameStatus (VideoGameStatusId, Name, ColorCode) VALUES (3, 'Completed', '#08824e');

-- VideoGameSystem
INSERT INTO VideoGameSystem (VideoGameSystemId, Name, ColorCode) VALUES (1, 'PC', '#4f1e57');
INSERT INTO VideoGameSystem (VideoGameSystemId, Name, ColorCode) VALUES (2, 'Nintendo Switch', '#8e0b24');
INSERT INTO VideoGameSystem (VideoGameSystemId, Name, ColorCode) VALUES (3, 'PlayStation', '#191f77');
INSERT INTO VideoGameSystem (VideoGameSystemId, Name, ColorCode) VALUES (4, 'Xbox', '#1b903f');