import express from 'express';

import { VideoGameRepository } from '@repositories/VideoGameRepository';

import { VideoGame, VideoGameGenre, VideoGameSystem } from '@models/videoGame';

const videoGameRouter = express.Router();

videoGameRouter.get('/genre', (_, res) => {
	VideoGameRepository.GetAllVideoGameGenres()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.get('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	VideoGameRepository.GetVideoGameGenreById(id)
		.then(([error, genre]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!genre) {
				return res.status(404).json({ error: 'Genre not found' });
			} else {
				return res.json(genre);
			}
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.post('/genre', (req, res) => {
	const { videoGameGenreId, name, colorCode } = req.body;

	const genre: VideoGameGenre = {
		videoGameGenreId: parseInt(videoGameGenreId),
		name,
		colorCode,
	};

	VideoGameRepository.AddVideoGameGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.put('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const genre: VideoGameGenre = {
		videoGameGenreId: id,
		name,
		colorCode,
	};

	VideoGameRepository.UpdateVideoGameGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.delete('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	VideoGameRepository.DeleteVideoGameGenre(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.get('/system', (_, res) => {
	VideoGameRepository.GetAllVideoGameSystems()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.get('/system/:id', (req, res) => {
	const id = parseInt(req.params.id);

	VideoGameRepository.GetVideoGameSystemById(id)
		.then(([error, genre]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!genre) {
				return res.status(404).json({ error: 'System not found' });
			} else {
				return res.json(genre);
			}
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.post('/system', (req, res) => {
	const { videoGameSystemId, name, colorCode } = req.body;

	const system: VideoGameSystem = {
		videoGameSystemId: parseInt(videoGameSystemId),
		name,
		colorCode,
	};

	VideoGameRepository.AddVideoGameSystem(system)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.put('/system/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const system: VideoGameSystem = {
		videoGameSystemId: id,
		name,
		colorCode,
	};

	VideoGameRepository.UpdateVideoGameSystem(system)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.delete('/system/:id', (req, res) => {
	const id = parseInt(req.params.id);

	VideoGameRepository.DeleteVideoGameSystem(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.get('/current', (_, res) => {
	VideoGameRepository.GetCurrentVideoGames()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.get('/', (_, res) => {
	VideoGameRepository.GetAllVideoGames()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.get('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	VideoGameRepository.GetVideoGameById(id)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!data) {
				return res.status(404).json({ error: 'Video game not found' });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.post('/', (req, res) => {
	const {
		videoGameStatusId,
		videoGameCompletionId,
		title,
		link,
		dateStarted,
		dateCompleted,
		rating,
		thoughts,
		coverImageUrl,
		sortOrder,
		genres,
		systems,
	} = req.body;

	const videoGame: VideoGame = {
		videoGameId: 0,
		videoGameStatusId,
		videoGameCompletionId,
		title,
		link,
		dateStarted,
		dateCompleted,
		rating: rating ?? 0,
		thoughts: thoughts ?? '',
		coverImageUrl: coverImageUrl ?? '',
		sortOrder,
		genres: genres.map((g: number) => ({ videoGameGenreId: g, name: '', colorCode: '' })),
		systems: systems.map((s: number) => ({ videoGameSystemId: s, name: '', colorCode: '' })),
	};

	VideoGameRepository.AddVideoGame(videoGame)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.put('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const {
		videoGameStatusId,
		videoGameCompletionId,
		title,
		link,
		dateStarted,
		dateCompleted,
		rating,
		thoughts,
		coverImageUrl,
		sortOrder,
		genres,
		systems,
	} = req.body;

	const videoGame: VideoGame = {
		videoGameId: id,
		videoGameStatusId,
		videoGameCompletionId,
		title,
		link,
		dateStarted,
		dateCompleted,
		rating: rating ?? 0,
		thoughts: thoughts ?? '',
		coverImageUrl: coverImageUrl ?? '',
		sortOrder,
		genres: genres.map((g: number) => ({ videoGameGenreId: g, name: '', colorCode: '' })),
		systems: systems.map((s: number) => ({ videoGameSystemId: s, name: '', colorCode: '' })),
	};

	VideoGameRepository.UpdateVideoGame(videoGame)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

videoGameRouter.delete('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	VideoGameRepository.DeleteVideoGame(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

export { videoGameRouter };
