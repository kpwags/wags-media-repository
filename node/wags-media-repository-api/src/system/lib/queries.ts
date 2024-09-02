export type VideoServiceQueryReturn = {
    VideoServiceId: number;
    Name: string;
    ColorCode: string;
    TvShowCount: number;
    MovieCount: number;
}

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
