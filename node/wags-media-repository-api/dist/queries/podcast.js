"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPodcastCategories = exports.listPodcasts = void 0;
exports.listPodcasts = `
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
exports.listPodcastCategories = `
SELECT
	PodcastCategoryId,
	Name,
	ColorCode
FROM PodcastCategory
ORDER BY Name ASC;
`;
