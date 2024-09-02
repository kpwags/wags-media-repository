export type LinkQueryReturn = {
    LinkId: number;
    LinkTypeId: number;
    Title: string;
    Url: string;
    Author: string;
    LinkDate: Date;
    ReadingLogIssueNumber: number;
    LinkCategoryId: number;
    LinkCategoryName: string;
    LinkCategoryColor: string;
    LinkTypeName: string;
    LinkTypeColor: string;
}

export type LinkCategoryQueryReturn = {
    LinkCategoryId: number;
    Name: string;
    ColorCode: string;
    LinkCount: number;
}

export const getLinkCategories = `
SELECT
	L.LinkCategoryId,
	L.Name,
	L.ColorCode,
	(SELECT COUNT(LinkId) FROM Link WHERE  LinkCategoryId = L.LinkCategoryId) AS LinkCount
FROM LinkCategory L
ORDER BY Name ASC;
`;

export const getLinkCategoryById = `
SELECT
	L.LinkCategoryId,
	L.Name,
	L.ColorCode,
	(SELECT COUNT(LinkId) FROM Link WHERE  LinkCategoryId = L.LinkCategoryId) AS LinkCount
FROM LinkCategory L
WHERE LinkCategoryId = ?
`;

export const insertLinkCategory = `
INSERT INTO LinkCategory (Name, ColorCode)
VALUES (?, ?);
`;

export const updateLinkCategory = `
UPDATE LinkCategory SET
    Name = ?,
    ColorCode = ?
WHERE LinkCategoryId = ?;
`;

export const deleteLinkCategory = `DELETE FROM LinkCategory WHERE LinkCategoryId = ?;`;

export const getLinks = `
SELECT
    L.LinkId,
    L.LinkTypeId,
    L.LinkCategoryId,
    L.Title,
    L.Url,
    L.Author,
    L.LinkDate,
    L.ReadingLogIssueNumber,
    LC.Name AS LinkCategoryName,
    LC.ColorCode AS LinkCategoryColor,
    LT.Name AS LinkTypeName,
    LT.ColorCode AS LinkTypeColor
FROM Link L
JOIN LinkCategory LC ON LC.LinkCategoryId = L.LinkCategoryId
JOIN LinkType LT ON LT.LinkTypeId = L.LinkTypeId
ORDER BY L.LinkDate DESC;
`;

export const getLinkById = `
SELECT
    LinkId,
    LinkTypeId,
    LinkCategoryId,
    Title,
    Url,
    Author,
    LinkDate,
    ReadingLogIssueNumber,
    LC.Name AS LinkCategoryName,
    LC.ColorCode AS LinkCategoryColor,
    LT.Name AS LinkTypeName,
    LT.ColorCode AS LinkTypeColor
FROM Link L
JOIN LinkCategory LC ON LC.LinkCategoryId = L.LinkCategoryId
JOIN LinkType LT ON LT.LinkTypeId = L.LinkTypeId
WHERE L.LinkId = ?
`;

export const insertLink = `
INSERT INTO Link (LinkTypeId, LinkCategoryId, Title, Url, Author, LinkDate, ReadingLogIssueNumber)
VALUES (?, ?, ?, ?, ?, ?, ?);
`;

export const updateLink = `
UPDATE Link SET
    LinkTypeId = ?,
    LinkCategoryId = ?,
    Title = ?,
    Url = ?,
    Author = ?,
    LinkDate = ?,
    ReadingLogIssueNumber = ?
WHERE LinkId = ?;
`;

export const deleteLink = `DELETE FROM Link WHERE LinkId = ?;`;