import express from 'express';

import podcastRepository from './lib/PodcastRepository';
import { Podcast, PodcastCategory } from '../models/podcast';

const router = express.Router();

router.get('/categories', (_, res) => {
    podcastRepository.GetAllPodcastCategories((data) => res.json(data));
});

router.get('/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    podcastRepository.GetPodcastCategoryById(id, (category) => {
        if (!category) {
            res.status(404).json({ error: 'Podcast category not found' });
        } else {
            res.json(category);
        }
    });
});

router.post('/categories', (req, res) => {
    const { podcastCategoryId, name, colorCode } = req.body;

    const category: PodcastCategory = {
        podcastCategoryId: parseInt(podcastCategoryId),
        name,
        colorCode,
    };

    podcastRepository.AddPodcastCategory(category);
    res.send();
});

router.put('/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { podcastCategoryId, name, colorCode } = req.body;

    const category: PodcastCategory = {
        podcastCategoryId: parseInt(podcastCategoryId),
        name,
        colorCode,
    };

    podcastRepository.UpdatePodcastCategory(category);
    res.send();
});

router.delete('/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);

    podcastRepository.DeletePodcastCategory(id);

    res.send();
});

router.get('/', (_, res) => {
    podcastRepository.GetAllPodcasts((data) => res.json(data));
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    podcastRepository.GetPodcastById(id, (podcast) => {
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

    podcastRepository.AddPodcast(podcast);
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

    podcastRepository.UpdatePodcast(podcast);
    res.send();
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    podcastRepository.DeletePodcast(id);

    res.send();
});

export default router;