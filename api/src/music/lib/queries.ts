export type MusicAlbumQueryReturn = {
    MusicAlbumId: number;
    Title: string;
    Artist: string;
    Thoughts: string;
    CoverImageUrl: string;
    IsTopTen: boolean;
    ShowOnNowPage: boolean;
}

export type AlbumTrackQueryReturn = {
    MusicAlbumTrackId: number;
    MusicAlbumId: number;
    TrackNumber: number;
    Title: string;
}

export type MusicGenreLinkQueryReturn = {
    MusicAlbumId: number;
    MusicGenreId: number;
    MusicGenreName: string;
    MusicGenreColor: string;
}

export type MusicFormatLinkQueryReturn = {
    MusicAlbumId: number;
    MusicFormatId: number;
    MusicFormatName: string;
    MusicFormatColor: string;
}

export type MusicGenreQueryReturn = {
    MusicGenreId: number;
    Name: string;
    ColorCode: string;
    MusicAlbumCount?: number;
}

export type MusicFormatQueryReturn = {
    MusicFormatId: number;
    Name: string;
    ColorCode: string;
}

export const getAllMusicAlbums = `
SELECT
    MusicAlbumId,
    Title,
    Artist,
    Thoughts,
    CoverImageUrl,
    IsTopTen,
    ShowOnNowPage
FROM MusicAlbum
ORDER BY Artist;
`;

export const getMusicAlbumsOnNowPage = `
SELECT
    MusicAlbumId,
    Title,
    Artist,
    Thoughts,
    CoverImageUrl,
    IsTopTen,
    ShowOnNowPage
FROM MusicAlbum
WHERE
    ShowOnNowPage = 1
ORDER BY Artist;
`;

export const getMusicAlbumById = `
SELECT
    MusicAlbumId,
    Title,
    Artist,
    Thoughts,
    CoverImageUrl,
    IsTopTen,
    ShowOnNowPage
FROM MusicAlbum
WHERE
    MusicAlbumId = ?;
`;

export const insertMusicAlbum = `
INSERT INTO MusicAlbum (Title, Artist, Thoughts, CoverImageUrl, IsTopTen, ShowOnNowPage)
VALUES (?, ?, ?, ?, ?, ?);
`;

export const updateMusicAlbum = `
UPDATE MusicAlbum SET
    Title = ?,
    Artist = ?,
    Thoughts = ?,
    CoverImageUrl = ?,
    IsTopTen = ?,
    ShowOnNowPage = ?
WHERE
    MusicAlbumId = ?;
`;

export const deleteMusicAlbum = `
DELETE FROM MusicAlbum WHERE MusicAlbumId = ?;
`;

export const getAllTracks = `
SELECT
    MusicAlbumTrackId,
    MusicAlbumId,
    TrackNumber,
    Title
FROM MusicAlbumTrack;
`;

export const getTracksForAlbum = `
SELECT
    MusicAlbumTrackId,
    MusicAlbumId,
    TrackNumber,
    Title
FROM MusicAlbumTrack
WHERE
    MusicAlbumId = ?;
`;

export const clearTracksFromAlbum = `
    DELETE FROM MusicAlbumTrack WHERE MusicAlbumId = ?;
`;

export const getAllMusicGenreLinks = `
SELECT
    MG.MusicAlbumId,
    MG.MusicGenreId,
    G.Name AS MusicGenreName,
    G.ColorCode AS MusicGenreColor
FROM MusicAlbumToMusicGenre MG
JOIN MusicGenre G ON G.MusicGenreId = MG.MusicGenreId
`;

export const getAllMusicFormatLinks = `
SELECT
    MF.MusicAlbumId,
    MF.MusicFormatId,
    F.Name AS MusicFormatName,
    F.ColorCode AS MusicFormatColor
FROM MusicAlbumToMusicFormat MF
JOIN MusicFormat F ON F.MusicFormatId = MF.MusicFormatId
`;

export const getGenresForMusicAlbum = `
SELECT
    MusicGenreId,
	Name,
	ColorCode
FROM MusicGenre
WHERE
    MusicGenreId = ?;
`;

export const getFormatsForMusicAlbum = `
SELECT
    MusicFormatId,
    Name,
    ColorCode
FROM MusicFormat
WHERE
   MusicFormatId = ?;
`;

export const clearMusicAlbumGenreLinks = `DELETE FROM MusicAlbumToMusicGenre WHERE MusicAlbumId = ?`;

export const clearMusicAlbumFormatLinks = `DELETE FROM MusicAlbumToMusicFormat WHERE MusicAlbumId = ?`;

export const insertMusicAlbumGenreLink = `
INSERT INTO MusicAlbumToMusicGenre (MusicAlbumId, MusicGenreId)
VALUES (?, ?)
`;

export const insertMusicAlbumFormatLink = `
INSERT INTO MusicAlbumToMusicFormat (MusicAlbumId, MusicFormatId)
VALUES (?, ?)
`;

export const getLastInsertedId = 'SELECT MAX(MusicAlbumId) AS LastInsertedId FROM MusicAlbum';

export const getAllMusicGenres = `
SELECT
    MG.MusicGenreId,
    MG.Name,
    MG.ColorCode,
    (SELECT COUNT(MusicAlbumToMusicGenreId) FROM MusicAlbumToMusicGenre WHERE MusicGenreId = MG.MusicGenreId) AS MusicAlbumCount
FROM MusicGenre MG
ORDER BY MG.Name;
`;

export const getMusicGenreById = `
SELECT
    MusicGenreId,
    Name,
    ColorCode
FROM MusicGenre
WHERE
    MusicGenreId = ?;
`;

export const insertMusicGenre = `
INSERT INTO MusicGenre (Name, ColorCode)
VALUES (?, ?);
`;

export const updateMusicGenre = `
UPDATE MusicGenre SET
    Name = ?,
    ColorCode = ?
WHERE MusicGenreId = ?;
`;

export const deleteMusicGenre = `
DELETE FROM MusicGenre WHERE MusicGenreId = ?
`;

export const insertAlbumTrack = `
INSERT INTO MusicAlbumTrack (MusicAlbumId, TrackNumber, Title)
VALUES (?, ?, ?);
`;
