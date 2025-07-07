import express from 'express';

import { PodcastRepository } from '@repositories/PodcastRepository';
import { Podcast, PodcastCategory } from '@models/podcast';

const podcastRouter = express.Router();

podcastRouter.get('/category', (_, res) => {
	PodcastRepository.GetAllPodcastCategories()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.get('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	PodcastRepository.GetPodcastCategoryById(id)
		.then(([error, category]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!category) {
				res.status(404).json({ error: 'Podcast category not found' });
			} else {
				res.json(category);
			}
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.post('/category', (req, res) => {
	const { podcastCategoryId, name, colorCode } = req.body;

	const category: PodcastCategory = {
		podcastCategoryId: parseInt(podcastCategoryId),
		name,
		colorCode,
	};

	PodcastRepository.AddPodcastCategory(category)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.put('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const category: PodcastCategory = {
		podcastCategoryId: id,
		name,
		colorCode,
	};

	PodcastRepository.UpdatePodcastCategory(category)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.delete('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	PodcastRepository.DeletePodcastCategory(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.get('/', (_, res) => {
	PodcastRepository.GetAllPodcasts()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});;
});

podcastRouter.get('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	PodcastRepository.GetPodcastById(id)
		.then(([error, podcast]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			if (!podcast) {
				res.status(404).json({ error: 'Podcast not found' });
			} else {
				res.json(podcast);
			}
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.post('/', (req, res) => {
	const formBody = req.body;

	const podcast: Podcast = {
		podcastId: 0,
		podcastCategoryId: parseInt(formBody.podcastCategoryId),
		name: formBody.name,
		link: formBody.link,
		coverImageUrl: formBody.coverImageUrl,
		category: {
			podcastCategoryId: parseInt(formBody.podcastCategoryId),
			name: '',
			colorCode: '',
		},
	};

	PodcastRepository.AddPodcast(podcast)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.put('/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const formBody = req.body;

	const podcast: Podcast = {
		podcastId: id,
		podcastCategoryId: parseInt(formBody.podcastCategoryId),
		name: formBody.name,
		link: formBody.link,
		coverImageUrl: formBody.coverImageUrl,
		category: {
			podcastCategoryId: parseInt(formBody.podcastCategoryId),
			name: '',
			colorCode: '',
		},
	};

	PodcastRepository.UpdatePodcast(podcast)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

podcastRouter.delete('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	PodcastRepository.DeletePodcast(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

export { podcastRouter };