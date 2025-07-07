export type BookSeries = {
	bookSeriesId: number;
	name: string;
	colorCode: string;
	bookCount?: number;
}

export type BookGenre = {
	bookGenreId: number;
	name: string;
	colorCode: string;
	bookCount?: number;
}

export type BookFormat = {
	bookFormatId: number;
	name: string;
	colorCode: string;
	bookCount?: number;
}

export type BookStatus = {
	bookStatusId: number;
	name: string;
	colorCode: string;
}

export type BookType = {
	bookTypeId: number;
	name: string;
	colorCode: string;
}

export type Book = {
	bookId: number;
	bookStatusId: number;
	bookTypeId: number;
	bookSeriesId?: number;
	title: string;
	subTitle: string;
	fullTitle?: string;
	author: string;
	link: string;
	dateStarted?: Date | string | null;
	dateCompleted?: Date | string | null;
	rating: number;
	thoughts: string;
	bookNotesUrl?: string;
	coverImageUrl: string;
	currentPage: number;
	pageCount: number;
	progress: number;
	sortOrder?: number;
	isAtLibrary: boolean;
	isPurchased: boolean;
	heardAboutFrom: string;
	genres: BookGenre[];
	formats: BookFormat[];
	status?: BookStatus;
	type?: BookType;
	series?: BookSeries;
}

export type BookGenreLink = {
	bookId: number;
	genreId: number;
	genreName: string;
	genreColorCode: string;
}

export type BookFormatLink = {
	bookId: number;
	formatId: number;
	fomatName: string;
	formatColorCode: string;
}

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
	HeardAboutFrom: string;
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