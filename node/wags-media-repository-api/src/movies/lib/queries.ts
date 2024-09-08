export type MovieQueryReturn = {
    MovieId: number;
    DateWatched: Date;
    ImdbLink: string;
    MovieStatusId: number;
    PosterImageUrl: string;
    Rating: number;
    Thoughts: string;
    Title: string;
    SortOrder: number;
}

export type MovieGenreLinkQueryReturn = {
    MovieId: number;
    VideoGenreId: number;
    VideoGenreName: string;
    VideoGenreColor: string;
}

export type MovieServiceLinkQueryReturn = {
    MovieId: number;
    VideoServiceId: number;
    VideoServiceName: string;
    VideoServiceColor: string;
}

export const getAllMovies = `
SELECT
    M.MovieId,
    M.MovieStatusId,
    M.Title,
    M.ImdbLink,
    M.PosterImageUrl,
    M.DateWatched,
    M.Rating,
    M.Thoughts,
    M.SortOrder,
    MS.Name AS MovieStatusName,
    MS.ColorCode AS MovieStatusColor
FROM Movie M
JOIN MovieStatus MS ON MS.MovieStatusId = M.MovieStatusId
ORDER BY M.DateWatched DESC;
`;

export const getAllMovieGenreLinks = `
SELECT
    VG.MovieId,
    VG.VideoGenreId,
    G.Name AS VideoGenreName,
    G.ColorCode AS VideoGenreColor
FROM MovieToVideoGenre VG
JOIN VideoGenre G ON G.VideoGenreId = VG.VideoGenreId
`;

export const getAllMovieServiceLinks = `
SELECT
    MS.MovieId,
    MS.VideoServiceId,
    VS.Name AS VideoServiceName,
    VS.ColorCode AS VideoServiceColor
FROM MovieToVideoService MS
JOIN VideoService VS ON VS.VideoServiceId = MS.VideoServiceId
`;

export const getGenresForMovie = `
SELECT
    VG.VideoGenreId,
	VG.Name,
	VG.ColorCode
FROM VideoGenre VG
JOIN MovieToVideoGenre MVG ON MVG.VideoGenreId = VG.VideoGenreId
WHERE
    MVG.MovieId = ?;
`;

export const getServicesForMovie = `
SELECT
    VS.VideoServiceId,
	VS.Name,
	VS.ColorCode
FROM VideoService VS
JOIN MovieToVideoService MVS ON MVS.VideoServiceId = VS.VideoServiceId
WHERE
    MVS.MovieId = ?;
`;

export const getMovieById = `
SELECT
    M.MovieId,
    M.MovieStatusId,
    M.Title,
    M.ImdbLink,
    M.PosterImageUrl,
    M.DateWatched,
    M.Rating,
    M.Thoughts,
    M.SortOrder,
    MS.Name AS MovieStatusName,
    MS.ColorCode AS MovieStatusColor
FROM Movie M
JOIN MovieStatus MS ON MS.MovieStatusId = M.MovieStatusId
WHERE M.MovieId = ?
`;

export const insertMovie = `
INSERT INTO Movie (MovieStatusId, Title, ImdbLink, PosterImageUrl, DateWatched, Rating, Thoughts, SortOrder)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

export const updateMovie = `
UPDATE Movie SET
    MovieStatusId = ?,
    Title = ?,
    ImdbLink = ?,
    PosterImageUrl = ?,
    DateWatched = ?,
    Rating = ?,
    Thoughts = ?,
    SortOrder = ?
WHERE MovieId = ?;
`;

export const clearMovieGenreLinks = `DELETE FROM MovieToVideoGenre WHERE MovieId = ?`;

export const clearMovieServiceLinks = `DELETE FROM MovieToVideoService WHERE MovieId = ?`;

export const insertMovieGenreLink = `
INSERT INTO MovieToVideoGenre (MovieId, VideoGenreId)
VALUES (?, ?)
`;

export const insertMovieServiceLink = `
INSERT INTO MovieToVideoService (MovieId, VideoServiceId)
VALUES (?, ?)
`;

export const deleteMovie = `DELETE FROM Movie WHERE MovieId = ?;`;

export const getLastInsertedId = 'SELECT MAX(MovieId) AS LastInsertedId FROM Movie';
