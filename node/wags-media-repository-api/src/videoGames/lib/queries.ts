export type VideoGameQueryReturn = {
    VideoGameId: number;
    VideoGameStatusId: number;
    VideoGameCompletionId: number;
    Title: string;
    Link: string;
    DateStarted?: Date;
    DateCompleted?: Date;
    Rating: number;
    Thoughts: string;
    CoverImageUrl: string;
    SortOrder?: number;
    VideoGameStatusName: string;
    VideoGameStatusColor: string;
    VideoGameCompletionName: string;
    VideoGameCompletionColor: string;
}

export type VideoGameGenreLinkQueryReturn = {
    VideoGameId: number;
    VideoGameGenreId: number;
    VideoGameGenreName: string;
    VideoGameGenreColor: string;
}

export type VideoGameSystemLinkQueryReturn = {
    VideoGameId: number;
    VideoGameSystemId: number;
    VideoGameSystemName: string;
    VideoGameSystemColor: string;
}

export type VideoGameGenreQueryReturn = {
    VideoGameGenreId: number;
    Name: string;
    ColorCode: string;
    VideoGameCount: number;
}

export type VideoGameSystemQueryReturn = {
    VideoGameSystemId: number;
    Name: string;
    ColorCode: string;
    VideoGameCount: number;
}

export const getAllVideoGames = `
SELECT
    VG.VideoGameId,
    VG.VideoGameStatusId,
    VG.VideoGameCompletionId,
    VG.Title,
    VG.Link,
    VG.DateStarted,
    VG.DateCompleted,
    VG.Rating,
    VG.Thoughts,
    VG.CoverImageUrl,
    VG.SortOrder,
    VGS.Name AS VideoGameStatusName,
    VGS.ColorCode AS VideoGameStatusColor,
    VGC.Name AS VideoGameCompletionName,
    VGC.ColorCode AS VideoGameCompletionColor
FROM VideoGame VG
JOIN VideoGameStatus VGS ON VGS.VideoGameStatusId = VG.VideoGameStatusId
JOIN VideoGameCompletion VGC ON VGC.VideoGameCompletionId = VG.VideoGameCompletionId;
`;

export const getVideoGameById = `
SELECT
    VG.VideoGameId,
    VG.VideoGameStatusId,
    VG.VideoGameCompletionId,
    VG.Title,
    VG.Link,
    VG.DateStarted,
    VG.DateCompleted,
    VG.Rating,
    VG.Thoughts,
    VG.CoverImageUrl,
    VG.SortOrder,
    VGS.Name AS VideoGameStatusName,
    VGS.ColorCode AS VideoGameStatusColor,
    VGC.Name AS VideoGameCompletionName,
    VGC.ColorCode AS VideoGameCompletionColor
FROM VideoGame VG
JOIN VideoGameStatus VGS ON VGS.VideoGameStatusId = VG.VideoGameStatusId
JOIN VideoGameCompletion VGC ON VGC.VideoGameCompletionId = VG.VideoGameCompletionId
WHERE
    VG.VideoGameId = ?;
`;

export const insertVideoGame = `
INSERT INTO VideoGame (VideoGameStatusId, VideoGameCompletionId, Title, Link, DateStarted, DateCompleted, Rating, Thoughts, CoverImageUrl, SortOrder)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const updateVideoGame = `
UPDATE VideoGame SET
    VideoGameStatusId = ?,
    VideoGameCompletionId = ?,
    Title = ?,
    Link = ?,
    DateStarted = ?,
    DateCompleted = ?,
    Rating = ?,
    Thoughts = ?,
    CoverImageUrl = ?,
    SortOrder = ?
WHERE VideoGameId = ?;
`;

export const deleteVideoGame = `
DELETE FROM VideoGame WHERE VideoGameId = ?;
`;

export const getAllVideoGameGenreLinks = `
SELECT
    VGG.VideoGameId,
    VGG.VideoGameGenreId,
    G.Name AS VideoGameGenreName,
    G.ColorCode AS VideoGameGenreColor
FROM VideoGameToVideoGameGenre VGG
JOIN VideoGameGenre G ON G.VideoGameGenreId = VGG.VideoGameGenreId
`;

export const getAllVideoGameSystemLinks = `
SELECT
    VGS.VideoGameId,
    VGS.VideoGameSystemId,
    S.Name AS VideoGameSystemName,
    S.ColorCode AS VideoGameSystemColor
FROM VideoGameToVideoGameSystem VGS
JOIN VideoGameSystem S ON S.VideoGameSystemId = VGS.VideoGameSystemId;
`;

export const getGenresForVideoGame = `
SELECT
    G.VideoGameGenreId,
	G.Name,
	G.ColorCode
FROM VideoGameGenre G
JOIN VideoGameToVideoGameGenre VGG ON VGG.VideoGameGenreId = G.VideoGameGenreId
WHERE
    VVG.VideoGameId = ?;
`;

export const getSystemsForVideoGame = `
SELECT
    VS.VideoServiceId,
	VS.Name,
	VS.ColorCode
FROM VideoGameSystem VS
JOIN VideoGameToVideoGameSystem VGS ON VGS.VideoGameSystemId = VS.VideoGameSystemId
WHERE
    TVS.VideoGameId = ?
`;

export const clearVideoGameGenreLinks = `
DELETE FROM VideoGameToVideoGameGenre WHERE VideoGameId = ?
`;

export const clearVideoGameSystemLinks = `
DELETE FROM VideoGameToVideoGameSystem WHERE VideoGameId = ?
`;

export const insertVideoGameGenreLink = `
INSERT INTO VideoGameToVideoGameGenre (VideoGameId, VideoGameGenreId)
VALUES (?, ?)
`;

export const insertVideoGameSystemLink = `
INSERT INTO VideoGameToVideoGameSystem (VideoGameId, VideoGameSystemId)
VALUES (?, ?)
`;

export const getLastInsertedId = 'SELECT MAX(VideoGameId) AS LastInsertedId FROM VideoGame';

export const getAllVideoGameGenres = `
SELECT
    VG.VideoGameGenreId,
    VG.Name,
    VG.ColorCode,
    (SELECT COUNT(VideoGameToVideoGameGenreId) FROM VideoGameToVideoGameGenre WHERE VideoGameGenreId = VG.VideoGameGenreId) AS VideoGameCount
FROM VideoGameGenre VG
ORDER BY VG.Name;
`;

export const getVideoGameGenreById = `
SELECT
    VideoGameGenreId,
    Name,
    ColorCode
FROM VideoGameGenre
WHERE
    VideoGameGenreId = ?;
`;

export const insertVideoGameGenre = `
INSERT INTO VideoGameGenre (Name, ColorCode)
VALUES (?, ?);
`;

export const updateVideoGameGenre = `
UPDATE VideoGameGenre SET
    Name = ?,
    ColorCode = ?
WHERE VideoGameGenreId = ?;
`;

export const deleteVideoGameGenre = `
DELETE FROM VideoGameGenre WHERE VideoGameGenreId = ?
`;

export const getAllVideoGameSystems = `
SELECT
    VS.VideoGameSystemId,
    VS.Name,
    VS.ColorCode,
    (SELECT COUNT(VideoGameToVideoGameSystemId) FROM VideoGameToVideoGameSystem WHERE VideoGameSystemId = VS.VideoGameSystemId) AS VideoGameCount
FROM VideoGameSystem VS
ORDER BY VS.Name;
`;

export const getVideoGameSystemById = `
SELECT
    VideoGameSystemId,
    Name,
    ColorCode
FROM VideoGameSystem
WHERE
    VideoGameSystemId = ?;
`;

export const insertVideoGameSystem = `
INSERT INTO VideoGameSystem (Name, ColorCode)
VALUES (?, ?);
`;

export const updateVideoGameSystem = `
UPDATE VideoGameSystem SET
    Name = ?,
    ColorCode = ?
WHERE VideoGameSystemId = ?;
`;

export const deleteVideoGameSystem = `
DELETE FROM VideoGameSystem WHERE VideoGameSystemId = ?
`;
