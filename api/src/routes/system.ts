import express from 'express';

import { SystemRepository } from '@repositories/SystemRepository';
import { VideoGenre, VideoService } from '@models/system';

const systemRouter = express.Router();

systemRouter.get('/video-genre', (_, res) => {
	SystemRepository.GetAllVideoGenres()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.get('/video-genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	SystemRepository.GetVideoGenreById(id)
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

systemRouter.post('/video-genre', (req, res) => {
	const { name, colorCode } = req.body;

	const genre: VideoGenre = {
		videoGenreId: 0,
		name,
		colorCode,
	};

	SystemRepository.AddVideoGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.put('/video-genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const genre: VideoGenre = {
		videoGenreId: id,
		name,
		colorCode,
	};

	SystemRepository.UpdateVideoGenre(genre)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.delete('/video-genre/:id', (req, res) => {
	const id = parseInt(req.params.id);

	SystemRepository.DeleteVideoGenre(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.get('/video-service', (_, res) => {
	SystemRepository.GetAllVideoServices()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.get('/video-service/:id', (req, res) => {
	const id = parseInt(req.params.id);

	SystemRepository.GetVideoServiceById(id)
		.then(([error, category]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!category) {
				return res.status(404).json({ error: 'Video service not found' });
			} else {
				return res.json(category);
			}
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.post('/video-service', (req, res) => {
	const { videoServiceId, name, colorCode } = req.body;

	const service: VideoService = {
		videoServiceId: parseInt(videoServiceId),
		name,
		colorCode,
	};

	SystemRepository.AddVideoService(service)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.put('/video-service/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const service: VideoService = {
		videoServiceId: id,
		name,
		colorCode,
	};

	SystemRepository.UpdateVideoService(service)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

systemRouter.delete('/video-service/:id', (req, res) => {
	const id = parseInt(req.params.id);

	SystemRepository.DeleteVideoService(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});

	res.send();
});

export { systemRouter };