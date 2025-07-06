export const getAllTelevisionShows = `
SELECT
	T.TelevisionShowId,
	T.ImdbLink,
	T.TelevisionStatusId,
	T.CoverImageUrl,
	T.Rating,
	T.Thoughts,
	T.Title,
	T.SortOrder,
	T.SeasonEpisodeCount,
	T.CurrentSeasonEpisode,
	TS.Name AS TelevsionShowStatusName,
	TS.ColorCode AS TelevsionShowStatusColor
FROM TelevisionShow T
JOIN TelevisionStatus TS ON TS.TelevisionStatusId = T.TelevisionStatusId
ORDER BY T.Title DESC;
`;

export const getAllTvGenreLinks = `
SELECT
	TG.TelevisionShowId,
	TG.VideoGenreId,
	G.Name AS VideoGenreName,
	G.ColorCode AS VideoGenreColor
FROM TelevisionShowToVideoGenre TG
JOIN VideoGenre G ON G.VideoGenreId = TG.VideoGenreId
`;

export const getAllTvServiceLinks = `
SELECT
	TS.TelevisionShowId,
	TS.VideoServiceId,
	VS.Name AS VideoServiceName,
	VS.ColorCode AS VideoServiceColor
FROM TelevisionShowToVideoService TS
JOIN VideoService VS ON VS.VideoServiceId = TS.VideoServiceId
`;

export const getGenresForTelevisionShow = `
SELECT
	VG.VideoGenreId,
	VG.Name,
	VG.ColorCode
FROM VideoGenre VG
JOIN TelevisionShowToVideoGenre TVG ON TVG.VideoGenreId = VG.VideoGenreId
WHERE
	TVG.TelevisionShowId = ?;
`;

export const getServicesForTelevisionShow = `
SELECT
	VS.VideoServiceId,
	VS.Name,
	VS.ColorCode
FROM VideoService VS
JOIN TelevisionShowToVideoService TVS ON MVS.VideoServiceId = VS.VideoServiceId
WHERE
	TVS.TelevisionShowId = ?;
`;

export const getTelevisionShowById = `
SELECT
	T.TelevisionShowId,
	T.ImdbLink,
	T.TelevisionStatusId,
	T.CoverImageUrl,
	T.Rating,
	T.Thoughts,
	T.Title,
	T.SortOrder,
	T.SeasonEpisodeCount,
	T.CurrentSeasonEpisode,
	TS.Name AS TelevsionShowStatusName,
	TS.ColorCode AS TelevsionShowStatusColor
FROM TelevisionShow T
JOIN TelevisionStatus TS ON TS.TelevisionStatusId = T.TelevisionStatusId
WHERE T.TelevisionShowId = ?
`;

export const insertTelevsionShow = `
INSERT INTO TelevisionShow (ImdbLink, TelevisionStatusId, CoverImageUrl, Rating, Thoughts, Title, SortOrder, SeasonEpisodeCount, CurrentSeasonEpisode)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const updateTelevisionShow = `
UPDATE TelevisionShow SET
	ImdbLink = ?,
	TelevisionStatusId = ?,
	CoverImageUrl = ?,
	Rating = ?,
	Thoughts = ?,
	Title = ?,
	SortOrder = ?,
	SeasonEpisodeCount = ?,
	CurrentSeasonEpisode = ?
WHERE TelevisionShowId = ?;
`;

export const clearTvGenreLinks = `DELETE FROM TelevisionShowToVideoGenre WHERE TelevisionShowId = ?`;

export const clearTvServiceLinks = `DELETE FROM TelevisionShowToVideoService WHERE TelevisionShowId = ?`;

export const insertTvGenreLink = `
INSERT INTO TelevisionShowToVideoGenre (TelevisionShowId, VideoGenreId)
VALUES (?, ?)
`;

export const insertTvServiceLink = `
INSERT INTO TelevisionShowToVideoService (TelevisionShowId, VideoServiceId)
VALUES (?, ?)
`;

export const deleteTelevisionShow = `DELETE FROM TelevisionShow WHERE TelevisionShowId = ?;`;

export const getLastInsertedId = 'SELECT MAX(TelevisionShowId) AS LastInsertedId FROM TelevisionShow';

export const getCurrentTelevisionShows = `
SELECT
	T.TelevisionShowId,
	T.ImdbLink,
	T.TelevisionStatusId,
	T.CoverImageUrl,
	T.Rating,
	T.Thoughts,
	T.Title,
	T.SortOrder,
	T.SeasonEpisodeCount,
	T.CurrentSeasonEpisode,
	TS.Name AS TelevsionShowStatusName,
	TS.ColorCode AS TelevsionShowStatusColor
FROM TelevisionShow T
JOIN TelevisionStatus TS ON TS.TelevisionStatusId = T.TelevisionStatusId
WHERE
	T.TelevisionStatusId = 3
ORDER BY T.Title DESC;
`;

export const updateTelevisionShowProgress = `
UPDATE TelevisionShow SET
	CurrentSeasonEpisode = ?
WHERE TelevisionShowId = ?;
`;