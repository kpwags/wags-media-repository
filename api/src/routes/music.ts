import express from 'express';

const musicRouter = express.Router();

import { MusicRepository } from '@repositories/MusicRepository';
import { MusicAlbum, AlbumTrack, MusicGenre } from '@models/music';

musicRouter.get('/genre', (_, res) => {
	MusicRepository.GetAllMusicGenres()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.get('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	MusicRepository.GetMusicGenreById(id)
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

musicRouter.post('/genre', (req, res) => {
	const { musicGenreId, name, colorCode } = req.body;

	const genre: MusicGenre = {
		musicGenreId: parseInt(musicGenreId),
		name,
		colorCode,
	};

	MusicRepository.AddMusicGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.put('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const genre: MusicGenre = {
		musicGenreId: id,
		name,
		colorCode,
	};

	MusicRepository.UpdateMusicGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.delete('/genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	MusicRepository.DeleteMusicGenre(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.put('/tracks/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const {
		tracks,
	} = req.body;

	const albumTracks: AlbumTrack[] = tracks
		.map((t: { trackNumber: number, title: string }) => ({
			musicAlbumTrackId: 0,
			musicAlbumId: id,
			trackNumber: t.trackNumber,
			title: t.title,
		}));

	MusicRepository.UpdateAlbumTracks(id, albumTracks)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.get('/now', (_, res) => {
	MusicRepository.GetMusicAlbumsOnNowPage()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.get('/', (_, res) => {
	MusicRepository.GetAllMusicAlbums()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.get('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	MusicRepository.GetMusicAlbumById(id)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!data) {
				return res.status(404).json({ error: 'Album not found' });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.post('/', (req, res) => {
	const {
		title,
		artist,
		thoughts,
		coverImageUrl,
		isTopTen,
		showOnNowPage,
		genres,
		formats,
	} = req.body;

	const album: MusicAlbum = {
		musicAlbumId: 0,
		title,
		artist,
		thoughts: thoughts ?? '',
		coverImageUrl: coverImageUrl ?? '',
		isTopTen: isTopTen ?? false,
		showOnNowPage: showOnNowPage ?? false,
		genres: genres.map((g: number) => ({ musicGenreId: g, name: '', colorCode: '' })),
		formats: formats.map((f: number) => ({ musicFormatId: f, name: '', colorCode: '' })),
		tracks: [],
	};

	MusicRepository.AddMusicAlbum(album)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.put('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const {
		title,
		artist,
		thoughts,
		coverImageUrl,
		isTopTen,
		showOnNowPage,
		genres,
		formats,
	} = req.body;

	const album: MusicAlbum = {
		musicAlbumId: id,
		title,
		artist,
		thoughts: thoughts ?? '',
		coverImageUrl: coverImageUrl ?? '',
		isTopTen: isTopTen ?? false,
		showOnNowPage: showOnNowPage ?? false,
		genres: genres.map((g: number) => ({ musicGenreId: g, name: '', colorCode: '' })),
		formats: formats.map((f: number) => ({ musicFormatId: f, name: '', colorCode: '' })),
		tracks: [],
	};

	MusicRepository.UpdateMusicAlbum(album)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

musicRouter.delete('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	MusicRepository.DeleteMusicAlbum(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

export { musicRouter };