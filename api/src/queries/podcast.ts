export const getPodcasts = `
SELECT
    P.PodcastId,
    P.Name,
    P.Link,
    P.CoverImageUrl,
    P.PodcastCategoryId,
    PC.Name AS [PodcastCategoryName],
    PC.ColorCode
FROM Podcast P
JOIN PodcastCategory PC ON PC.PodcastCategoryId = P.PodcastCategoryId
ORDER BY P.Name ASC;
`;

export const getPodcastById = `
SELECT
    P.PodcastId,
    P.Name,
    P.Link,
    P.CoverImageUrl,
    P.PodcastCategoryId,
    PC.Name AS [PodcastCategoryName],
    PC.ColorCode
FROM Podcast P
JOIN PodcastCategory PC ON PC.PodcastCategoryId = P.PodcastCategoryId
WHERE PodcastId = ?
`;

export const insertPodcast = `
INSERT INTO Podcast (Name, Link, CoverImageUrl, PodcastCategoryId)
VALUES (?, ?, ?, ?);
`;

export const updatePodcast = `
UPDATE Podcast SET
    PodcastCategoryId = ?,
    Name = ?,
    Link = ?,
    CoverImageUrl = ?
WHERE PodcastId = ?;
`;

export const deletePodcast = `DELETE FROM Podcast WHERE PodcastId = ?;`;

export const getPodcastCategories = `
SELECT
	PC.PodcastCategoryId,
	PC.Name,
	PC.ColorCode,
	(SELECT COUNT(PodcastId) FROM Podcast WHERE  PodcastCategoryId = PC.PodcastCategoryId) AS PodcastCount
FROM PodcastCategory PC
ORDER BY Name ASC;
`;

export const getPodcastCategoryById = `
SELECT
    PC.PodcastCategoryId,
	PC.Name,
	PC.ColorCode,
	(SELECT COUNT(PodcastId) FROM Podcast WHERE  PodcastCategoryId = PC.PodcastCategoryId) AS PodcastCount
FROM PodcastCategory
WHERE PodcastCategoryId = ?
`;

export const insertPodcastCategory = `
INSERT INTO PodcastCategory (Name, ColorCode)
VALUES (?, ?);
`;

export const updatePodcastCategory = `
UPDATE PodcastCategory SET
    Name = ?,
    ColorCode = ?
WHERE PodcastCategoryId = ?;
`;

export const deletePodcastCategory = `DELETE FROM PodcastCategory WHERE PodcastCategoryId = ?;`;
