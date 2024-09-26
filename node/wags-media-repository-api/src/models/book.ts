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
    dateStarted?: Date;
    dateCompleted?: Date;
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