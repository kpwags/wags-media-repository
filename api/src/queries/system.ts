export const getAllVideoGenres = `
SELECT
	VG.VideoGenreId,
	VG.Name,
	VG.ColorCode,
	0 AS TvShowCount,
	(SELECT COUNT(MovieToVideoGenreId) FROM MovieToVideoGenre WHERE VideoGenreId = VG.VideoGenreId) AS MovieCount
FROM VideoGenre VG
ORDER BY Name ASC;
`;

export const getVideoGenreById = `
SELECT
	VG.VideoGenreId,
	VG.Name,
	VG.ColorCode,
	0 AS TvShowCount,
	(SELECT COUNT(MovieToVideoGenreId) FROM MovieToVideoGenre WHERE VideoGenreId = VG.VideoGenreId) AS MovieCount
FROM VideoGenre VG
WHERE MovieGenreId = ?
`;

export const insertVideoGenre = `
INSERT INTO VideoGenre (Name, ColorCode)
VALUES (?, ?);
`;

export const updateVideoGenre = `
UPDATE VideoGenre SET
	Name = ?,
	ColorCode = ?
WHERE VideoGenreId = ?;
`;

export const deleteVideoGenre = `DELETE FROM VideoGenre WHERE VideoGenreId = ?;`;

export const getAllVideoServices = `
SELECT
	VS.VideoServiceId,
	VS.Name,
	VS.ColorCode,
	0 AS TvShowCount,
	(SELECT COUNT(MovieToVideoServiceId) FROM MovieToVideoService WHERE VideoServiceId = VS.VideoServiceId) AS MovieCount
FROM VideoService VS
ORDER BY Name ASC;
`;

export const getVideoServiceById = `
SELECT
	VS.VideoServiceId,
	VS.Name,
	VS.ColorCode,
	0 AS TvShowCount,
	(SELECT COUNT(MovieToVideoServiceId) FROM MovieToVideoService WHERE VideoServiceId = VS.VideoServiceId) AS MovieCount
FROM VideoService VS
WHERE VideoServiceId = ?
`;

export const insertVideoService = `
INSERT INTO VideoService (Name, ColorCode)
VALUES (?, ?);
`;

export const updateVideoService = `
UPDATE VideoService SET
	Name = ?,
	ColorCode = ?
WHERE VideoServiceId = ?;
`;

export const deleteVideoService = `DELETE FROM VideoService WHERE VideoServiceId = ?;`;