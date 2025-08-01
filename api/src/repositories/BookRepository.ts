import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { db } from '@lib/db';
import calculateProgress from '@lib/calculateProgress';
import buildBookTitle from '@lib/buildBookTitle';
import convertDateToJsonDate from '@lib/convertDateToJsonDate';
import convertToBoolean from '@lib/convertToBoolean';

import {
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
	updateBookToFinished,
} from '@queries/book';

import {
	Book,
	BookGenre,
	BookSeries,
	BookGenreLink,
	BookFormatLink,
	BookFormat,
	BookQueryReturn,
	BookGenreLinkQueryReturn,
	BookFormatLinkQueryReturn,
	BookGenreQueryReturn,
	BookFormatQueryReturn,
	BookSeriesQueryReturn,
} from '@models/book';

dayjs.extend(isSameOrAfter);

class BookRepository {
	static async GetAllBooks(): Promise<[error: string | null, books: Book[]]> {
		const [
			[booksError, data],
			[formatsError, formats],
			[genresError, genres],
		] = await Promise.all([
			db.Query<BookQueryReturn>(getAllBooks),
			this.GetAllBookFormatLinks(),
			this.GetAllBookGenreLinks(),
		]);

		if (booksError || formatsError || genresError) {
			return [booksError ?? formatsError ?? genresError, []];
		}

		const books: Book[] = [];

		data.forEach((row) => {
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
				heardAboutFrom: row.HeardAboutFrom,
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
				genres: genres
					.filter((g) => g.bookId === row.BookId)
					.map((g) => ({ bookGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				formats: formats
					.filter((f) => f.bookId === row.BookId)
					.map((f) => ({ bookFormatId: f.formatId, name: f.fomatName, colorCode: f.formatColorCode })),
			});
		});

		return [null, books];
	}

	static async GetBookById(bookId: number): Promise<[error: string | null, book: Book | null]> {
		const [
			[bookError, book],
			[formatsError, formats],
			[genresError, genres],
		] = await Promise.all([
			db.QuerySingle<BookQueryReturn>(getBookById, [bookId]),
			this.GetFormatsForBook(bookId),
			this.GetGenresForBook(bookId),
		]);

		if (bookError || formatsError || genresError) {
			return [bookError ?? formatsError ?? genresError, null];
		}

		if (!book) {
			return [null, null];
		}

		return [null, {
			bookId: book.BookId,
			bookStatusId: book.BookStatusId,
			bookTypeId: book.BookTypeId,
			bookSeriesId: book.BookSeriesId,
			title: book.Title,
			subTitle: book.SubTitle,
			fullTitle: buildBookTitle(book.Title, book.SubTitle),
			author: book.Author,
			link: book.Link,
			dateStarted: convertDateToJsonDate(book.DateStarted),
			dateCompleted: convertDateToJsonDate(book.DateCompleted),
			rating: book.Rating,
			thoughts: book.Thoughts,
			bookNotesUrl: book.BookNotesUrl,
			coverImageUrl: book.CoverImageUrl,
			currentPage: book.CurrentPage,
			pageCount: book.PageCount,
			progress: calculateProgress(book.CurrentPage, book.PageCount),
			sortOrder: book.SortOrder,
			isAtLibrary: convertToBoolean(book.IsAtLibrary),
			isPurchased: convertToBoolean(book.IsPurchased),
			heardAboutFrom: book.HeardAboutFrom,
			status: {
				bookStatusId: book.BookStatusId,
				name: book.BookStatusName,
				colorCode: book.BookStatusColor,
			},
			type: {
				bookTypeId: book.BookTypeId,
				name: book.BookTypeName,
				colorCode: book.BookTypeColor,
			},
			series: book.BookSeriesId
				? { bookSeriesId: book.BookSeriesId, name: book.BookSeriesName ?? '', colorCode: book.BookSeriesColor ?? '' }
				: undefined,
			genres,
			formats,
		}];
	};

	static async GetCurrentBooks(): Promise<[error: string | null, books: Book[]]> {
		const [
			[booksError, data],
			[formatsError, formats],
			[genresError, genres],
		] = await Promise.all([
			db.Query<BookQueryReturn>(getCurrentlyReadingBooks),
			this.GetAllBookFormatLinks(),
			this.GetAllBookGenreLinks(),
		]);

		if (booksError || formatsError || genresError) {
			return [booksError ?? formatsError ?? genresError, []];
		}

		const books: Book[] = [];

		data.forEach((row) => {
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
				heardAboutFrom: row.HeardAboutFrom,
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
				genres: genres
					.filter((g) => g.bookId === row.BookId)
					.map((g) => ({ bookGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				formats: formats
					.filter((f) => f.bookId === row.BookId)
					.map((f) => ({ bookFormatId: f.formatId, name: f.fomatName, colorCode: f.formatColorCode })),
			});
		});

		return [null, books];
	}

	static async GetRecentBooks(days: number): Promise<[error: string | null, books: Book[]]> {
		const [
			[booksError, data],
			[formatsError, formats],
			[genresError, genres],
		] = await Promise.all([
			db.Query<BookQueryReturn>(getAllBooks),
			this.GetAllBookFormatLinks(),
			this.GetAllBookGenreLinks(),
		]);

		if (booksError || formatsError || genresError) {
			return [booksError ?? formatsError ?? genresError, []];
		}

		const books: Book[] = [];

		data.forEach((row) => {
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
					heardAboutFrom: row.HeardAboutFrom,
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
					genres: genres
						.filter((g) => g.bookId === row.BookId)
						.map((g) => ({ bookGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
					formats: formats
						.filter((f) => f.bookId === row.BookId)
						.map((f) => ({ bookFormatId: f.formatId, name: f.fomatName, colorCode: f.formatColorCode })),
				});
			}
		});

		return [null, books];
	}

	static async AddBookGenreLinks(genres: { bookId: number, genreId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < genres.length; i++) {
			const genre = genres[i];

			const err = await db.Execute(insertBookGenreLink, [genre.bookId, genre.genreId]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async AddBookFormatLinks(formats: { bookId: number, formatId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < formats.length; i++) {
			const format = formats[i];

			const err = await db.Execute(insertBookFormatLink, [format.bookId, format.formatId]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async GetLastInsertedRowId(): Promise<[error: string | null, id: number | null]> {
		const [error, data] = await db.QuerySingle<{ LastInsertedId: number }>(getLastInsertedId);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, data.LastInsertedId];
	}

	static async AddBook(book: Book): Promise<string | null> {
		const error = await db.Execute(insertBook, [
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
			book.heardAboutFrom,
		]);

		if (error) {
			return error;
		}

		const [idError, bookId] = await this.GetLastInsertedRowId();

		if (idError || !bookId) {
			return idError ?? 'Unable to retrieve book ID';
		}

		const genres = book.genres.map((g) => ({ bookId, genreId: g.bookGenreId }));
		const formats = book.formats.map((f) => ({ bookId, formatId: f.bookFormatId }));

		const [addFormatLinksError, addGenreLinksError] = await Promise.all([
			this.AddBookFormatLinks(formats),
			this.AddBookGenreLinks(genres),
		])

		return addFormatLinksError ?? addGenreLinksError ?? null;
	}

	static async UpdateBook(book: Book): Promise<string | null> {
		const [
			updateError,
			deleteFormatLinksError,
			deleteGenreLinksError,
		] = await Promise.all([
			db.Execute(updateBook, [
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
				book.heardAboutFrom,
				book.bookId,
			]),
			this.DeleteBookFormatLinks(book.bookId),
			this.DeleteBookGenreLinks(book.bookId),
		]);

		if (updateError || deleteFormatLinksError || deleteGenreLinksError) {
			return updateError ?? deleteFormatLinksError ?? deleteGenreLinksError;
		}

		const genres = book.genres.map((g) => ({ bookId: book.bookId, genreId: g.bookGenreId }));
		const formats = book.formats.map((f) => ({ bookId: book.bookId, formatId: f.bookFormatId }));

		const [addFormatLinksError, addGenreLinksError] = await Promise.all([
			this.AddBookFormatLinks(formats),
			this.AddBookGenreLinks(genres),
		])

		return addFormatLinksError ?? addGenreLinksError ?? null;
	}

	static async DeleteBookFormatLinks(bookId: number): Promise<string | null> {
		return await db.Execute(clearBookFormatLinks, [bookId]);
	}

	static async DeleteBookGenreLinks(bookId: number): Promise<string | null> {
		return await db.Execute(clearBookGenreLinks, [bookId]);
	}

	static async DeleteBook(bookId: number): Promise<string | null> {
		const [deleteFormatLinksError, deleteGenreLinksError] = await Promise.all([
			this.DeleteBookFormatLinks(bookId),
			this.DeleteBookGenreLinks(bookId),
		]);

		if (deleteFormatLinksError || deleteGenreLinksError) {
			return deleteFormatLinksError ?? deleteGenreLinksError;
		}

		return await db.Execute(deleteBook, [bookId]);
	}

	static async GetAllBookGenreLinks(): Promise<[error: string | null, genreLinks: BookGenreLink[]]> {
		const [error, data] = await db.Query<BookGenreLinkQueryReturn>(getAllBookGenreLinks);

		if (error) {
			return [error, []];
		}

		const genreLinks: BookGenreLink[] = [];

		data.forEach((row) => {
			genreLinks.push({
				bookId: row.BookId,
				genreId: row.BookGenreId,
				genreName: row.BookGenreName,
				genreColorCode: row.BookGenreColor,
			});
		});

		return [null, genreLinks];
	}

	static async GetAllBookFormatLinks(): Promise<[error: string | null, formatLinks: BookFormatLink[]]> {
		const [error, data] = await db.Query<BookFormatLinkQueryReturn>(getAllBookFormatLinks);

		if (error) {
			return [error, []];
		}

		const formatLinks: BookFormatLink[] = [];

		data.forEach((row) => {
			formatLinks.push({
				bookId: row.BookId,
				formatId: row.BookFormatId,
				fomatName: row.BookFormatName,
				formatColorCode: row.BookFormatColor,
			});
		});

		return [null, formatLinks];
	}

	static async GetGenresForBook(bookId: number): Promise<[error: string | null, genres: BookGenre[]]> {
		const [error, data] = await db.Query<BookGenreQueryReturn>(getGenresForBook, [bookId]);

		if (error) {
			return [error, []];
		}

		const genres: BookGenre[] = [];

		data.forEach((row) => {
			genres.push({
				bookGenreId: row.BookGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
				bookCount: row.BookCount,
			});
		});

		return [null, genres];
	}

	static async GetFormatsForBook(bookId: number): Promise<[error: string | null, formats: BookFormat[]]> {
		const [error, data] = await db.Query<BookFormatQueryReturn>(getFormatsForBook, [bookId]);

		if (error) {
			return [error, []];
		}

		const formats: BookFormat[] = [];

		data.forEach((row) => {
			formats.push({
				bookFormatId: row.BookFormatId,
				name: row.Name,
				colorCode: row.ColorCode,
				bookCount: row.BookCount,
			});
		});

		return [null, formats];
	}

	static async GetAllBookGenres(): Promise<[error: string | null, genres: BookGenre[]]> {
		const [error, data] = await db.Query<BookGenreQueryReturn>(getAllBookGenres);

		if (error) {
			return [error, []];
		}

		const genres: BookGenre[] = [];

		data.forEach((row) => {
			genres.push({
				bookGenreId: row.BookGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
				bookCount: row.BookCount,
			});
		});

		return [null, genres];
	}

	static async GetBookGenreById(id: number): Promise<[error: string | null, genre: BookGenre | null]> {
		const [error, data] = await db.QuerySingle<BookGenreQueryReturn>(getBookGenreById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			bookGenreId: data.BookGenreId,
			name: data.Name,
			colorCode: data.ColorCode,
			bookCount: data.BookCount,
		}];
	}

	static async AddBookGenre(genre: BookGenre): Promise<string | null> {
		return await db.Execute(insertBookGenre, [genre.name, genre.colorCode]);
	}

	static async UpdateBookGenre(genre: BookGenre): Promise<string | null> {
		return await db.Execute(updateBookGenre, [
			genre.name,
			genre.colorCode,
			genre.bookGenreId,
		]);
	}

	static async DeleteBookGenre(genreId: number): Promise<string | null> {
		return await db.Execute(deleteBookGenre, [genreId]);
	}

	static async GetAllBookSeries(): Promise<[error: string | null, series: BookSeries[]]> {
		const [error, data] = await db.Query<BookSeriesQueryReturn>(getAllBookSeries);

		if (error) {
			return [error, []];
		}

		const series: BookSeries[] = [];

		data.forEach((row) => {
			series.push({
				bookSeriesId: row.BookSeriesId,
				name: row.Name,
				colorCode: row.ColorCode,
				bookCount: row.BookCount,
			});
		});

		return [null, series];
	}

	static async GetBookSeriesById(id: number): Promise<[error: string | null, system: BookSeries | null]> {
		const [error, data] = await db.QuerySingle<BookSeriesQueryReturn>(getBookSeriesById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			bookSeriesId: data.BookSeriesId,
			name: data.Name,
			colorCode: data.ColorCode,
			bookCount: data.BookCount,
		}];
	}

	static async AddBookSeries(series: BookSeries): Promise<string | null> {
		return await db.Execute(insertBookSeries, [series.name, series.colorCode]);
	}

	static async UpdateBookSeries(series: BookSeries): Promise<string | null> {
		return await db.Execute(updateBookSeries, [
			series.name,
			series.colorCode,
			series.bookSeriesId,
		]);
	}

	static async DeleteBookSeries(seriesId: number): Promise<string | null> {
		return await db.Execute(deleteBookSeries, [seriesId]);
	}

	static async UpdateBookProgress(bookId: number, currentPage: number): Promise<string | null> {
		return await db.Execute(updateBookProgress, [currentPage, bookId]);
	}

	static async MarkBookAsFinished(bookId: number, rating: number, thoughts: string, dateCompleted: Date): Promise<string | null> {
		const [error, book] = await this.GetBookById(bookId);

		if (error || !book) {
			return error ?? 'Unable to mark book as finished, book not found.';
		}

		return await db.Execute(updateBookToFinished, [book.pageCount, rating, thoughts, dateCompleted, bookId]);
	}
};

export { BookRepository };