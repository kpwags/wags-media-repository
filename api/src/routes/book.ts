import express from 'express';

import { BookRepository } from '@repositories/BookRepository';

import { Book, BookGenre, BookSeries } from '@models/book';

const bookRouter = express.Router();

bookRouter.get('/genre', (_, res) => {
	BookRepository.GetAllBookGenres()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.get('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	BookRepository.GetBookGenreById(id)
		.then(([error, genre]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!genre) {
				return res.status(404).json({ error: 'Genre not found' });
			}

			return res.json(genre);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.post('/genre', (req, res) => {
	const { bookGenreId, name, colorCode } = req.body;

	const genre: BookGenre = {
		bookGenreId: parseInt(bookGenreId),
		name,
		colorCode,
	};

	BookRepository.AddBookGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.put('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const genre: BookGenre = {
		bookGenreId: id,
		name,
		colorCode,
	};

	BookRepository.UpdateBookGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.delete('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	BookRepository.DeleteBookGenre(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.get('/series', (_, res) => {
	BookRepository.GetAllBookSeries()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.get('/series/:id', (req, res) => {
	const id = parseInt(req.params.id);

	BookRepository.GetBookSeriesById(id)
		.then(([error, series]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!series) {
				return res.status(404).json({ error: 'Series not found' });
			}

			return res.json(series);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.post('/series', (req, res) => {
	const { bookSeriesId, name, colorCode } = req.body;

	const series: BookSeries = {
		bookSeriesId: parseInt(bookSeriesId),
		name,
		colorCode,
	};

	BookRepository.AddBookSeries(series)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.put('/series/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const series: BookSeries = {
		bookSeriesId: id,
		name,
		colorCode,
	};

	BookRepository.UpdateBookSeries(series)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.delete('/series/:id', (req, res) => {
	const id = parseInt(req.params.id);

	BookRepository.DeleteBookSeries(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.put('/update-progress/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { currentPage } = req.body;

	BookRepository.UpdateBookProgress(id, currentPage)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.put('/mark-finished/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { rating, thoughts, dateCompleted } = req.body;

	BookRepository.MarkBookAsFinished(id, rating, thoughts, dateCompleted)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.get('/current', (_, res) => {
	BookRepository.GetCurrentBooks()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.get('/recent/:days', (req, res) => {
	const limitInDays = parseInt(req.params.days);

	BookRepository.GetRecentBooks(limitInDays)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.get('/', (_, res) => {
	BookRepository.GetAllBooks()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.get('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	BookRepository.GetBookById(id)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!data) {
				return res.status(404).json({ error: 'Book not found' });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.post('/', (req, res) => {
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

	BookRepository.AddBook(book)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.put('/:id', (req, res) => {
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

	BookRepository.UpdateBook(book)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bookRouter.delete('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	BookRepository.DeleteBook(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

export { bookRouter };
