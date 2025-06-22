import express from 'express';

import BookRepository from './lib/BookRepository';

import { Book, BookGenre, BookSeries } from '../models/book';

const router = express.Router();

router.get('/genre', (_, res) => {
    BookRepository.GetAllBookGenres((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    BookRepository.GetBookGenreById(id, (error, genre) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!genre) {
            res.status(404).json({ error: 'Genre not found' });
        } else {
            res.json(genre);
        }
    });
});

router.post('/genre', (req, res) => {
    const { bookGenreId, name, colorCode } = req.body;

    const genre: BookGenre = {
        bookGenreId: parseInt(bookGenreId),
        name,
        colorCode,
    };

    BookRepository.AddBookGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const genre: BookGenre = {
        bookGenreId: id,
        name,
        colorCode,
    };

    BookRepository.UpdateBookGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    BookRepository.DeleteBookGenre(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.get('/series', (_, res) => {
    BookRepository.GetAllBookSeries((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/series/:id', (req, res) => {
    const id = parseInt(req.params.id);

    BookRepository.GetBookSeriesById(id, (error, genre) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!genre) {
            res.status(404).json({ error: 'Series not found' });
        } else {
            res.json(genre);
        }
    });
});

router.post('/series', (req, res) => {
    const { bookSeriesId, name, colorCode } = req.body;

    const series: BookSeries = {
        bookSeriesId: parseInt(bookSeriesId),
        name,
        colorCode,
    };

    BookRepository.AddBookSeries(series, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/series/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const series: BookSeries = {
        bookSeriesId: id,
        name,
        colorCode,
    };

    BookRepository.UpdateBookSeries(series, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/series/:id', (req, res) => {
    const id = parseInt(req.params.id);

    BookRepository.DeleteBookSeries(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.put('/update-progress/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { currentPage } = req.body;

    BookRepository.UpdateBookProgress(id, currentPage, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.get('/current', (_, res) => {
    BookRepository.GetAllBookGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        BookRepository.GetAllBookFormatLinks((formatLinkError, formatLinks) => {
            if (formatLinkError) {
                return res.status(400).json({ formatLinkError });
            }

            BookRepository.GetCurrentBooks((error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const books: Book[] = [];

                data.forEach((book) => {
                    book.genres = genreLinks
                        .filter((g) => g.bookId == book.bookId)
                        .map((g) => ({ bookGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    book.formats = formatLinks
                        .filter((f) => f.bookId == book.bookId)
                        .map((f) => ({ bookFormatId: f.formatId, name: f.fomatName, colorCode: f.formatColorCode }));

                    books.push(book);
                });

                res.json(books);
            });
        });
    });
});

router.get('/recent/:days', (req, res) => {
    const limitInDays = parseInt(req.params.days);

    BookRepository.GetAllBookGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        BookRepository.GetAllBookFormatLinks((formatLinkError, formatLinks) => {
            if (formatLinkError) {
                return res.status(400).json({ formatLinkError });
            }

            BookRepository.GetRecentBooks(limitInDays, (error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const books: Book[] = [];

                data.forEach((book) => {
                    book.genres = genreLinks
                        .filter((g) => g.bookId == book.bookId)
                        .map((g) => ({ bookGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    book.formats = formatLinks
                        .filter((f) => f.bookId == book.bookId)
                        .map((f) => ({ bookFormatId: f.formatId, name: f.fomatName, colorCode: f.formatColorCode }));

                    books.push(book);
                });

                res.json(books);
            });
        });
    });
});

router.get('/', (_, res) => {
    BookRepository.GetAllBookGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        BookRepository.GetAllBookFormatLinks((formatLinkError, formatLinks) => {
            if (formatLinkError) {
                return res.status(400).json({ formatLinkError });
            }

            BookRepository.GetAllBooks((error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const books: Book[] = [];

                data.forEach((book) => {
                    book.genres = genreLinks
                        .filter((g) => g.bookId == book.bookId)
                        .map((g) => ({ bookGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    book.formats = formatLinks
                        .filter((f) => f.bookId == book.bookId)
                        .map((f) => ({ bookFormatId: f.formatId, name: f.fomatName, colorCode: f.formatColorCode }));

                    books.push(book);
                });

                res.json(books);
            });
        });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    BookRepository.GetGenresForBook(id, (genreError, genres) => {
        if (genreError) {
            return res.status(400).json({ genreError });
        }

        BookRepository.GetFormatsForBook(id, (formatError, formats) => {
            if (formatError) {
                return res.status(400).json({ formatError });
            }

            BookRepository.GetBookById(id, (error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                if (!data) {
                    res.status(404).json({ error: 'Book not found' });
                } else {
                    res.json({
                        ...data,
                        genres,
                        formats,
                    });
                }
            });
        });
    });
});

router.post('/', (req, res) => {
    const {
        bookStatusId,
        bookTypeId,
        bookSeriesId,
        title,
        subTitle,
        author,
        link,
        dateStarted,
        dateCompleted,
        rating,
        thoughts,
        bookNotesUrl,
        coverImageUrl,
        currentPage,
        pageCount,
        sortOrder,
        isAtLibrary,
        isPurchased,
        heardAboutFrom,
        genres,
        formats,
    } = req.body;

    const book: Book = {
        bookId: 0,
        bookStatusId,
        bookTypeId,
        bookSeriesId,
        title,
        subTitle,
        author,
        link: link ?? '',
        dateStarted,
        dateCompleted,
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        bookNotesUrl: bookNotesUrl ?? '',
        coverImageUrl: coverImageUrl ?? '',
        currentPage: currentPage ?? 0,
        pageCount: pageCount ?? 1,
        progress: 0,
        sortOrder,
        isAtLibrary: isAtLibrary ?? false,
        isPurchased: isPurchased ?? false,
        heardAboutFrom: heardAboutFrom,
        genres: genres.map((g: number) => ({ bookGenreId: g, name: '', colorCode: '' })),
        formats: formats.map((f: number) => ({ bookFormatId: f, name: '', colorCode: '' })),
    };

    BookRepository.AddBook(book, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const {
        bookStatusId,
        bookTypeId,
        bookSeriesId,
        title,
        subTitle,
        author,
        link,
        dateStarted,
        dateCompleted,
        rating,
        thoughts,
        bookNotesUrl,
        coverImageUrl,
        currentPage,
        pageCount,
        sortOrder,
        isAtLibrary,
        isPurchased,
        heardAboutFrom,
        genres,
        formats,
    } = req.body;

    const book: Book = {
        bookId: id,
        bookStatusId,
        bookTypeId,
        bookSeriesId,
        title,
        subTitle,
        author,
        link,
        dateStarted,
        dateCompleted,
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        bookNotesUrl: bookNotesUrl ?? '',
        coverImageUrl: coverImageUrl ?? '',
        currentPage: currentPage ?? 0,
        pageCount: pageCount ?? 1,
        progress: 0,
        sortOrder,
        isAtLibrary,
        isPurchased,
        heardAboutFrom,
        genres: genres.map((g: number) => ({ bookGenreId: g, name: '', colorCode: '' })),
        formats: formats.map((f: number) => ({ bookFormatId: f, name: '', colorCode: '' })),
    };

    BookRepository.UpdateBook(book, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    BookRepository.DeleteBook(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;
