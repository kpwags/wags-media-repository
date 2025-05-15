import sqlite3 from 'sqlite3';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
import calculateProgress from '../../lib/calculateProgress';
import buildBookTitle from '../../lib/buildBookTitle';
import convertDateToJsonDate from '../../lib/convertDateToJsonDate';
import convertToBoolean from '../../lib/convertToBoolean';
import { db } from '../../lib/db';

import {
    BookQueryReturn,
    BookGenreLinkQueryReturn,
    BookFormatLinkQueryReturn,
    BookGenreQueryReturn,
    BookFormatQueryReturn,
    BookSeriesQueryReturn,
    getAllBooks,
    getBookById,
    insertBook,
    updateBook,
    deleteBook,
    getAllBookFormatLinks,
    getAllBookGenreLinks,
    getGenresForBook,
    getFormatsForBook,
    clearBookGenreLinks,
    clearBookFormatLinks,
    insertBookGenreLink,
    insertBookFormatLink,
    getLastInsertedId,
    getAllBookGenres,
    getBookGenreById,
    insertBookGenre,
    updateBookGenre,
    deleteBookGenre,
    getAllBookSeries,
    getBookSeriesById,
    insertBookSeries,
    updateBookSeries,
    deleteBookSeries,
    getCurrentlyReadingBooks,
    updateBookProgress,
    getBooksToReSort,
    updateBookSortOrder
} from './queries';

import {
    Book,
    BookGenre,
    BookSeries,
    BookGenreLink,
    BookFormatLink,
    BookFormat,
} from '../../models/book';

dayjs.extend(isSameOrAfter);

class BookRepository {
    private static GetDatabase = () => {
        sqlite3.verbose();

        return new sqlite3.Database(config.db);
    };

    static readonly GetAllBooks = (callback: (error: string | null, books: Book[]) => void) => {
        const db = this.GetDatabase();

        const books: Book[] = [];

        db.all(getAllBooks, (err: any, rows: BookQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                books.push({
                    bookId: row.BookId,
                    bookStatusId: row.BookStatusId,
                    bookTypeId: row.BookTypeId,
                    bookSeriesId: row.BookSeriesId,
                    title: row.Title,
                    subTitle: row.SubTitle,
                    fullTitle: buildBookTitle(row.Title, row.SubTitle),
                    author: row.Author,
                    link: row.Link,
                    dateStarted: convertDateToJsonDate(row.DateStarted),
                    dateCompleted: convertDateToJsonDate(row.DateCompleted),
                    rating: row.Rating,
                    thoughts: row.Thoughts,
                    bookNotesUrl: row.BookNotesUrl,
                    coverImageUrl: row.CoverImageUrl,
                    currentPage: row.CurrentPage,
                    pageCount: row.PageCount,
                    progress: calculateProgress(row.CurrentPage, row.PageCount),
                    sortOrder: row.SortOrder,
                    isAtLibrary: convertToBoolean(row.IsAtLibrary),
                    isPurchased: convertToBoolean(row.IsPurchased),
                    status: {
                        bookStatusId: row.BookStatusId,
                        name: row.BookStatusName,
                        colorCode: row.BookStatusColor,
                    },
                    type: {
                        bookTypeId: row.BookTypeId,
                        name: row.BookTypeName,
                        colorCode: row.BookTypeColor,
                    },
                    series: row.BookSeriesId
                        ? { bookSeriesId: row.BookSeriesId, name: row.BookSeriesName ?? '', colorCode: row.BookSeriesColor ?? '' }
                        : undefined,
                    genres: [],
                    formats: [],
                });
            });

            return callback(null, books);
        });
    };

    static readonly GetBookById = (bookId: number, callback: (error: string | null, book: Book | null) => void) => {
        const db = this.GetDatabase();

        db.get(getBookById, [bookId], (err: any, row: BookQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                bookId: row.BookId,
                bookStatusId: row.BookStatusId,
                bookTypeId: row.BookTypeId,
                bookSeriesId: row.BookSeriesId,
                title: row.Title,
                subTitle: row.SubTitle,
                fullTitle: buildBookTitle(row.Title, row.SubTitle),
                author: row.Author,
                link: row.Link,
                dateStarted: convertDateToJsonDate(row.DateStarted),
                dateCompleted: convertDateToJsonDate(row.DateCompleted),
                rating: row.Rating,
                thoughts: row.Thoughts,
                bookNotesUrl: row.BookNotesUrl,
                coverImageUrl: row.CoverImageUrl,
                currentPage: row.CurrentPage,
                pageCount: row.PageCount,
                progress: calculateProgress(row.CurrentPage, row.PageCount),
                sortOrder: row.SortOrder,
                isAtLibrary: convertToBoolean(row.IsAtLibrary),
                isPurchased: convertToBoolean(row.IsPurchased),
                status: {
                    bookStatusId: row.BookStatusId,
                    name: row.BookStatusName,
                    colorCode: row.BookStatusColor,
                },
                type: {
                    bookTypeId: row.BookTypeId,
                    name: row.BookTypeName,
                    colorCode: row.BookTypeColor,
                },
                series: row.BookSeriesId
                    ? { bookSeriesId: row.BookSeriesId, name: row.BookSeriesName ?? '', colorCode: row.BookSeriesColor ?? '' }
                    : undefined,
                genres: [],
                formats: [],
            });
        });
    };

    static readonly GetCurrentBooks = (callback: (error: string | null, books: Book[]) => void) => {
        const db = this.GetDatabase();

        const books: Book[] = [];

        db.all(getCurrentlyReadingBooks, (err: any, rows: BookQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                books.push({
                    bookId: row.BookId,
                    bookStatusId: row.BookStatusId,
                    bookTypeId: row.BookTypeId,
                    bookSeriesId: row.BookSeriesId,
                    title: row.Title,
                    subTitle: row.SubTitle,
                    fullTitle: buildBookTitle(row.Title, row.SubTitle),
                    author: row.Author,
                    link: row.Link,
                    dateStarted: convertDateToJsonDate(row.DateStarted),
                    dateCompleted: convertDateToJsonDate(row.DateCompleted),
                    rating: row.Rating,
                    thoughts: row.Thoughts,
                    bookNotesUrl: row.BookNotesUrl,
                    coverImageUrl: row.CoverImageUrl,
                    currentPage: row.CurrentPage,
                    pageCount: row.PageCount,
                    progress: calculateProgress(row.CurrentPage, row.PageCount),
                    sortOrder: row.SortOrder,
                    isAtLibrary: convertToBoolean(row.IsAtLibrary),
                    isPurchased: convertToBoolean(row.IsPurchased),
                    status: {
                        bookStatusId: row.BookStatusId,
                        name: row.BookStatusName,
                        colorCode: row.BookStatusColor,
                    },
                    type: {
                        bookTypeId: row.BookTypeId,
                        name: row.BookTypeName,
                        colorCode: row.BookTypeColor,
                    },
                    series: row.BookSeriesId
                        ? { bookSeriesId: row.BookSeriesId, name: row.BookSeriesName ?? '', colorCode: row.BookSeriesColor ?? '' }
                        : undefined,
                    genres: [],
                    formats: [],
                });
            });

            return callback(null, books);
        });
    };

    static readonly GetRecentBooks = (days: number, callback: (error: string | null, books: Book[]) => void) => {
        const db = this.GetDatabase();

        const books: Book[] = [];

        db.all(getAllBooks, (err: any, rows: BookQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                const limit = dayjs().subtract(days, 'day');

                if (row.DateCompleted && dayjs(row.DateCompleted).isSameOrAfter(limit)) {
                    books.push({
                        bookId: row.BookId,
                        bookStatusId: row.BookStatusId,
                        bookTypeId: row.BookTypeId,
                        bookSeriesId: row.BookSeriesId,
                        title: row.Title,
                        subTitle: row.SubTitle,
                        fullTitle: buildBookTitle(row.Title, row.SubTitle),
                        author: row.Author,
                        link: row.Link,
                        dateStarted: convertDateToJsonDate(row.DateStarted),
                        dateCompleted: convertDateToJsonDate(row.DateCompleted),
                        rating: row.Rating,
                        thoughts: row.Thoughts,
                        bookNotesUrl: row.BookNotesUrl,
                        coverImageUrl: row.CoverImageUrl,
                        currentPage: row.CurrentPage,
                        pageCount: row.PageCount,
                        progress: calculateProgress(row.CurrentPage, row.PageCount),
                        sortOrder: row.SortOrder,
                        isAtLibrary: convertToBoolean(row.IsAtLibrary),
                        isPurchased: convertToBoolean(row.IsPurchased),
                        status: {
                            bookStatusId: row.BookStatusId,
                            name: row.BookStatusName,
                            colorCode: row.BookStatusColor,
                        },
                        type: {
                            bookTypeId: row.BookTypeId,
                            name: row.BookTypeName,
                            colorCode: row.BookTypeColor,
                        },
                        series: row.BookSeriesId
                            ? { bookSeriesId: row.BookSeriesId, name: row.BookSeriesName ?? '', colorCode: row.BookSeriesColor ?? '' }
                            : undefined,
                        genres: [],
                        formats: [],
                    });
                }
            });

            return callback(null, books);
        });
    };

    static readonly AddBookGenreLinks = (genres: { bookId: number, genreId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];

            db.run(insertBookGenreLink, [genre.bookId, genre.genreId], function (err) {
                if (err) throw err;
            });
        }
    };

    static readonly AddBookFormatLinks = (formats: { bookId: number, formatId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < formats.length; i++) {
            const format = formats[i];

            db.run(insertBookFormatLink, [format.bookId, format.formatId], function (err) {
                if (err) throw err;
            });
        }
    };

    static readonly GetLastInsertedId = (callback: (error: string | null, id: number | null) => void) => {
        const db = this.GetDatabase();

        db.get(getLastInsertedId, (err: any, row: { LastInsertedId: number }) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            return callback(null, row.LastInsertedId);
        });
    };

    static readonly AddBook = (book: Book, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertBook, [
            book.bookStatusId,
            book.bookTypeId,
            book.bookSeriesId,
            book.title,
            book.subTitle,
            book.author,
            book.link,
            book.dateStarted,
            book.dateCompleted,
            book.rating,
            book.thoughts,
            book.bookNotesUrl,
            book.coverImageUrl,
            book.currentPage,
            book.pageCount,
            book.sortOrder,
            book.isAtLibrary,
            book.isPurchased,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            try {
                this.GetLastInsertedId((error, bookId) => {
                    if (error || !bookId) {
                        return callback(error ?? 'Error retrieving last ID');
                    }

                    const genres = book.genres.map((g) => ({ bookId, genreId: g.bookGenreId }));
                    const formats = book.formats.map((f) => ({ bookId, formatId: f.bookFormatId }));

                    this.AddBookGenreLinks(genres);
                    this.AddBookFormatLinks(formats);
                });
            } catch (e) {
                return callback((e as Error).message);
            }

            return callback(null);
        });
    };

    static readonly UpdateBook = (book: Book, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateBook, [
            book.bookStatusId,
            book.bookTypeId,
            book.bookSeriesId,
            book.title,
            book.subTitle,
            book.author,
            book.link,
            book.dateStarted,
            book.dateCompleted,
            book.rating,
            book.thoughts,
            book.bookNotesUrl,
            book.coverImageUrl,
            book.currentPage,
            book.pageCount,
            book.sortOrder,
            book.isAtLibrary,
            book.isPurchased,
            book.bookId,
        ], (err) => {
            if (err) {
                db.close();
                return callback(cleanSqliteError(err));
            }

            db.serialize(() => {
                db
                    .run(clearBookGenreLinks, [book.bookId])
                    .run(clearBookFormatLinks, [book.bookId], (error) => {
                        db.close();

                        if (error) {
                            return callback(cleanSqliteError(error));
                        }

                        const genres = book.genres.map((g) => ({ bookId: book.bookId, genreId: g.bookGenreId }));
                        const formats = book.formats.map((f) => ({ bookId: book.bookId, formatId: f.bookFormatId }));

                        this.AddBookGenreLinks(genres);
                        this.AddBookFormatLinks(formats);
                    });
            });

            return callback(null);
        });
    };

    static readonly DeleteBook = (bookId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.serialize(() => {
            db
                .run(clearBookGenreLinks, [bookId])
                .run(clearBookFormatLinks, [bookId])
                .run(deleteBook, [bookId], (err) => {
                    db.close();

                    if (err) {
                        return callback(cleanSqliteError(err));
                    }

                    return callback(null);
                });
        });
    };

    static readonly GetAllBookGenreLinks = (callback: (error: string | null, genreLinks: BookGenreLink[]) => void) => {
        const db = this.GetDatabase();

        const genreLinks: BookGenreLink[] = [];

        db.all(getAllBookGenreLinks, (err: any, rows: BookGenreLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genreLinks.push({
                    bookId: row.BookId,
                    genreId: row.BookGenreId,
                    genreName: row.BookGenreName,
                    genreColorCode: row.BookGenreColor,
                });
            });

            return callback(null, genreLinks);
        });
    };

    static readonly GetAllBookFormatLinks = (callback: (error: string | null, formatLinks: BookFormatLink[]) => void) => {
        const db = this.GetDatabase();

        const formatLinks: BookFormatLink[] = [];

        db.all(getAllBookFormatLinks, (err: any, rows: BookFormatLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                formatLinks.push({
                    bookId: row.BookId,
                    formatId: row.BookFormatId,
                    fomatName: row.BookFormatName,
                    formatColorCode: row.BookFormatColor,
                });
            });

            return callback(null, formatLinks);
        });
    };

    static readonly GetGenresForBook = (bookId: number, callback: (error: string | null, genres: BookGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: BookGenre[] = [];

        db.all(getGenresForBook, [bookId], (err: any, rows: BookGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    bookGenreId: row.BookGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    bookCount: row.BookCount,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetFormatsForBook = (bookId: number, callback: (error: string | null, formats: BookFormat[]) => void) => {
        const db = this.GetDatabase();

        const formats: BookFormat[] = [];

        db.all(getFormatsForBook, [bookId], (err: any, rows: BookFormatQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                formats.push({
                    bookFormatId: row.BookFormatId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    bookCount: row.BookCount,
                });
            });

            return callback(null, formats);
        });
    };

    static readonly GetAllBookGenres = (callback: (error: string | null, genres: BookGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: BookGenre[] = [];

        db.all(getAllBookGenres, (err: any, rows: BookGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    bookGenreId: row.BookGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    bookCount: row.BookCount,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetBookGenreById = (id: number, callback: (error: string | null, genre: BookGenre | null) => void) => {
        const db = this.GetDatabase();

        db.get(getBookGenreById, [id], (err, row: BookGenreQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                bookGenreId: row.BookGenreId,
                name: row.Name,
                colorCode: row.ColorCode,
                bookCount: row.BookCount,
            });
        });
    };

    static readonly AddBookGenre = (genre: BookGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertBookGenre, [genre.name, genre.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateBookGenre = (genre: BookGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateBookGenre, [
            genre.name,
            genre.colorCode,
            genre.bookGenreId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteBookGenre = (genreId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteBookGenre, [genreId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly GetAllBookSeries = (callback: (error: string | null, series: BookSeries[]) => void) => {
        const db = this.GetDatabase();

        const series: BookSeries[] = [];

        db.all(getAllBookSeries, (err: any, rows: BookSeriesQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                series.push({
                    bookSeriesId: row.BookSeriesId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    bookCount: row.BookCount,
                });
            });

            return callback(null, series);
        });
    };

    static readonly GetBookSeriesById = (id: number, callback: (error: string | null, system: BookSeries | null) => void) => {
        const db = this.GetDatabase();

        db.get(getBookSeriesById, [id], (err, row: BookSeriesQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                bookSeriesId: row.BookSeriesId,
                name: row.Name,
                colorCode: row.ColorCode,
                bookCount: row.BookCount,
            });
        });
    };

    static readonly AddBookSeries = (series: BookSeries, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertBookSeries, [series.name, series.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateBookSeries = (series: BookSeries, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateBookSeries, [
            series.name,
            series.colorCode,
            series.bookSeriesId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteBookSeries = (seriesId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteBookSeries, [seriesId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateBookProgress = (bookId: number, currentPage: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateBookProgress, [currentPage, bookId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static async UpdateBookSort(bookId: number, sortOrder: number) {
        await db.Execute(updateBookSortOrder, [sortOrder, bookId]);
    }

    static async ReorderBacklog(): Promise<string | null> {
        const [error, books] = await db.Query<{ BookId: number; SortOrder: number }>(getBooksToReSort);

        if (error) {
            return error;
        }

        let sortOrder = 10;

        for await (const book of books) {
            this.UpdateBookSort(book.BookId, sortOrder);
            sortOrder += 10;
        }

        return null;
    }
};

export default BookRepository;