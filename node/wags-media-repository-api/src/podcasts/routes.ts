import express from 'express';

import podcastRepository from './lib/PodcastRepository';
import { Podcast, PodcastCategory } from '../models/podcast';

const router = express.Router();

router.get('/category', (_, res) => {
    podcastRepository.GetAllPodcastCategories((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/category/:id', (req, res) => {
    const id = parseInt(req.params.id);
    podcastRepository.GetPodcastCategoryById(id, (error, category) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!category) {
            res.status(404).json({ error: 'Podcast category not found' });
        } else {
            res.json(category);
        }
    });
});

router.post('/category', (req, res) => {
    const { podcastCategoryId, name, colorCode } = req.body;

    const category: PodcastCategory = {
        podcastCategoryId: parseInt(podcastCategoryId),
        name,
        colorCode,
    };

    podcastRepository.AddPodcastCategory(category, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
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

    podcastRepository.UpdatePodcastCategory(category, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/category/:id', (req, res) => {
    const id = parseInt(req.params.id);

    podcastRepository.DeletePodcastCategory(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.get('/', (_, res) => {
    podcastRepository.GetAllPodcasts((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    podcastRepository.GetPodcastById(id, (error, podcast) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!podcast) {
            res.status(404).json({ error: 'Podcast not found' });
        } else {
            res.json(podcast);
        }
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

    podcastRepository.AddPodcast(podcast, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
    res.send();
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

    podcastRepository.UpdatePodcast(podcast, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
    res.send();
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    podcastRepository.DeletePodcast(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;