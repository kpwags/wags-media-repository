import express from 'express';

import podcastRepository from './lib/PodcastRepository';
import { Podcast, PodcastCategory } from '../models/podcast';

const router = express.Router();

router.get('/category', (_, res) => {
	podcastRepository.GetAllPodcastCategories()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

router.get('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	podcastRepository.GetPodcastCategoryById(id)
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

router.post('/category', (req, res) => {
	const { podcastCategoryId, name, colorCode } = req.body;

	const category: PodcastCategory = {
		podcastCategoryId: parseInt(podcastCategoryId),
		name,
		colorCode,
	};

	podcastRepository.AddPodcastCategory(category)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

router.put('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	const { name, colorCode } = req.body;

	const category: PodcastCategory = {
		podcastCategoryId: id,
		name,
		colorCode,
	};

	podcastRepository.UpdatePodcastCategory(category)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

router.delete('/category/:id', (req, res) => {
	const id = parseInt(req.params.id);

	podcastRepository.DeletePodcastCategory(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

router.get('/', (_, res) => {
	podcastRepository.GetAllPodcasts()
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.json(data);
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});;
});

router.get('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	podcastRepository.GetPodcastById(id)
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

router.post('/', (req, res) => {
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

	podcastRepository.AddPodcast(podcast)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

router.put('/:id', (req, res) => {
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

	podcastRepository.UpdatePodcast(podcast)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

router.delete('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	podcastRepository.DeletePodcast(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			res.send();
		}).catch((e) => {
			return res.status(400).json({ error: e });
		});
});

export default router;