export type BookQueryReturn = {
    BookId: number;
    BookStatusId: number;
    BookTypeId: number;
    BookSeriesId: number;
    Title: string;
    SubTitle: string;
    Author: string;
    Link: string;
    DateStarted?: Date;
    DateCompleted?: Date;
    Rating: number;
    Thoughts: string;
    BookNotesUrl: string;
    CoverImageUrl: string;
    CurrentPage: number;
    PageCount: number;
    Progress: number;
    SortOrder: number;
    IsAtLibrary: boolean;
    IsPurchased: boolean;
    BookStatusName: string;
    BookStatusColor: string;
    BookTypeName: string;
    BookTypeColor: string;
    BookSeriesName?: string;
    BookSeriesColor?: string;
}

export type BookGenreLinkQueryReturn = {
    BookId: number;
    BookGenreId: number;
    BookGenreName: string;
    BookGenreColor: string;
}

export type BookFormatLinkQueryReturn = {
    BookId: number;
    BookFormatId: number;
    BookFormatName: string;
    BookFormatColor: string;
}

export type BookGenreQueryReturn = {
    BookGenreId: number;
    Name: string;
    ColorCode: string;
    BookCount: number;
}

export type BookFormatQueryReturn = {
    BookFormatId: number;
    Name: string;
    ColorCode: string;
    BookCount: number;
}

export type BookSeriesQueryReturn = {
    BookSeriesId: number;
    Name: string;
    ColorCode: string;
    BookCount: number;
}

export const getAllBooks = `
SELECT
	B.BookId,
	B.BookStatusId,
	B.BookTypeId,
	B.BookSeriesId,
	B.Title,
	B.SubTitle,
	B.Author,
	B.Link,
	B.DateStarted,
	B.DateCompleted,
	B.Rating,
	B.Thoughts,
	B.BookNotesUrl,
	B.CoverImageUrl,
	B.CurrentPage,
	B.PageCount,
	B.SortOrder,
	B.IsAtLibrary,
	B.IsPurchased,
	BS.Name AS BookStatusName,
	BS.ColorCode AS BookStatusColor,
	BT.Name AS BookTypeName,
	BT.ColorCode AS BookTypeColor,
	BKS.Name AS BookSeriesName,
	BKS.ColorCode AS BookSeriesColor
FROM Book B
JOIN BookStatus BS ON BS.BookStatusId = B.BookStatusId
JOIN BookType BT ON BT.BookTypeId = B.BookTypeId
LEFT JOIN BookSeries BKS ON BKS.BookSeriesId = B.BookSeriesId
ORDER BY B.SortOrder;
`;

export const getBookById = `
SELECT
	B.BookId,
	B.BookStatusId,
	B.BookTypeId,
	B.BookSeriesId,
	B.Title,
	B.SubTitle,
	B.Author,
	B.Link,
	B.DateStarted,
	B.DateCompleted,
	B.Rating,
	B.Thoughts,
	B.BookNotesUrl,
	B.CoverImageUrl,
	B.CurrentPage,
	B.PageCount,
	B.SortOrder,
	B.IsAtLibrary,
	B.IsPurchased,
	BS.Name AS BookStatusName,
	BS.ColorCode AS BookStatusColor,
	BT.Name AS BookTypeName,
	BT.ColorCode AS BookTypeColor,
	BKS.Name AS BookSeriesName,
	BKS.ColorCode AS BookSeriesColor
FROM Book B
JOIN BookStatus BS ON BS.BookStatusId = B.BookStatusId
JOIN BookType BT ON BT.BookTypeId = B.BookTypeId
LEFT JOIN BookSeries BKS ON BKS.BookSeriesId = B.BookSeriesId
WHERE
    B.BookId = ?;
`;

export const insertBook = `
INSERT INTO Book (BookStatusId, BookTypeId, BookSeriesId, Title, SubTitle, Author, Link, DateStarted, DateCompleted, Rating, Thoughts, BookNotesUrl, CoverImageUrl, CurrentPage, PageCount, SortOrder, IsAtLibrary, IsPurchased)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`

export const updateBook = `
UPDATE Book SET
    BookStatusId = ?,
    BookTypeId = ?,
    BookSeriesId = ?,
    Title = ?,
    SubTitle = ?,
    Author = ?,
    Link = ?,
    DateStarted = ?,
    DateCompleted = ?,
    Rating = ?,
    Thoughts = ?,
    BookNotesUrl = ?,
    CoverImageUrl = ?,
    CurrentPage = ?,
    PageCount = ?,
    SortOrder = ?,
    IsAtLibrary = ?,
    IsPurchased = ?
WHERE
    BookId = ?;
`;

export const deleteBook = `
DELETE FROM Book WHERE BookId = ?;
`;

export const getAllBookGenreLinks = `
SELECT
    BG.BookId,
    BG.BookGenreId,
    G.Name AS BookGenreName,
    G.ColorCode AS BookGenreColor
FROM BookToBookGenre BG
JOIN BookGenre G ON G.BookGenreId = BG.BookGenreId;
`;

export const getAllBookFormatLinks = `
SELECT
    BF.BookId,
    BF.BookFormatId,
    F.Name AS BookFormatName,
    F.ColorCode AS BookFormatColor
FROM BookToBookFormat BF
JOIN BookFormat F ON F.BookFormatId = BF.BookFormatId;
`;

export const getGenresForBook = `
SELECT
    G.BookGenreId,
	G.Name,
	G.ColorCode
FROM BookGenre G
JOIN BookToBookGenre BG ON BG.BookGenreId = G.BookGenreId
WHERE
    BG.BookId = ?;
`;

export const getFormatsForBook = `
SELECT
    F.BookFormatId,
	F.Name,
	F.ColorCode
FROM BookFormat F
JOIN BookToBookFormat BF ON BF.BookFormatId = F.BookFormatId
WHERE
    BF.BookId = ?;
`;

export const clearBookGenreLinks = `
DELETE FROM BookToBookGenre WHERE BookId = ?;
`;

export const clearBookFormatLinks = `
DELETE FROM BookToBookFormat WHERE BookId = ?;
`;

export const insertBookGenreLink = `
INSERT INTO BookToBookGenre (BookId, BookGenreId)
VALUES (?, ?);
`;

export const insertBookFormatLink = `
INSERT INTO BookToBookFormat (BookId, BookFormatId)
VALUES (?, ?);
`;

export const getLastInsertedId = 'SELECT MAX(BookId) AS LastInsertedId FROM Book';

export const getAllBookGenres = `
SELECT
    BG.BookGenreId,
    BG.Name,
    BG.ColorCode,
    (SELECT COUNT(BookToBookGenreId) FROM BookToBookGenre WHERE BookGenreId = BG.BookGenreId) AS BookCount
FROM BookGenre BG
ORDER BY BG.Name;
`;

export const getBookGenreById = `
SELECT
    BookGenreId,
    Name,
    ColorCode,
    (SELECT COUNT(BookToBookGenreId) FROM BookToBookGenre WHERE BookGenreId = BG.BookGenreId) AS BookCount
FROM VideoGameGenre
WHERE
    VideoGameGenreId = ?;
`;

export const insertBookGenre = `
INSERT INTO BookGenre (Name, ColorCode)
VALUES (?, ?);
`;

export const updateBookGenre = `
UPDATE BookGenre SET
    Name = ?,
    ColorCode = ?
WHERE BookGenreId = ?;
`;

export const deleteBookGenre = `
DELETE FROM BookGenre WHERE BookGenreId = ?
`;

export const getAllBookSeries = `
SELECT
    BS.BookSeriesId,
    BS.Name,
    BS.ColorCode,
    (SELECT COUNT(BookId) FROM Book WHERE BookSeriesId = BS.BookSeriesId) AS BookCount
FROM BookSeries BS
ORDER BY BS.Name;
`;

export const getBookSeriesById = `
SELECT
    BS.BookSeriesId,
    BS.Name,
    BS.ColorCode,
    (SELECT COUNT(BookId) FROM Book WHERE BookSeriesId = BS.BookSeriesId) AS BookCount
FROM BookSeries BS
WHERE
    BookSeriesId = ?;
`;

export const insertBookSeries = `
INSERT INTO BookSeries (Name, ColorCode)
VALUES (?, ?);
`;

export const updateBookSeries = `
UPDATE BookSeries SET
    Name = ?,
    ColorCode = ?
WHERE BookSeriesId = ?;
`;

export const deleteBookSeries = `
DELETE FROM BookSeries WHERE BookSeriesId = ?;
`;

export const getCurrentlyReadingBooks = `
SELECT
	B.BookId,
	B.BookStatusId,
	B.BookTypeId,
	B.BookSeriesId,
	B.Title,
	B.SubTitle,
	B.Author,
	B.Link,
	B.DateStarted,
	B.DateCompleted,
	B.Rating,
	B.Thoughts,
	B.BookNotesUrl,
	B.CoverImageUrl,
	B.CurrentPage,
	B.PageCount,
	B.SortOrder,
	B.IsAtLibrary,
	B.IsPurchased,
	BS.Name AS BookStatusName,
	BS.ColorCode AS BookStatusColor,
	BT.Name AS BookTypeName,
	BT.ColorCode AS BookTypeColor,
	BKS.Name AS BookSeriesName,
	BKS.ColorCode AS BookSeriesColor
FROM Book B
JOIN BookStatus BS ON BS.BookStatusId = B.BookStatusId
JOIN BookType BT ON BT.BookTypeId = B.BookTypeId
LEFT JOIN BookSeries BKS ON BKS.BookSeriesId = B.BookSeriesId
WHERE
    B.BookStatusId = 2;
`;

export const updateBookProgress = `
UPDATE Book SET
    CurrentPage = ?
WHERE BookId = ?;
`;

export const getBooksToReSort = `
SELECT
	BookId,
	SortOrder
FROM Book
WHERE
    BookStatusId = 1
ORDER BY SortOrder;
`;

export const updateBookSortOrder = `
UPDATE Book SET
    SortOrder = ?
WHERE BookId = ?;
`;