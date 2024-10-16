import express from 'express';

import SystemRepository from './lib/SystemRepository';
import { VideoGenre, VideoService } from '../models/system';

const router = express.Router();

router.get('/video-genre', (_, res) => {
    SystemRepository.GetAllVideoGenres((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/video-genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    SystemRepository.GetVideoGenreById(id, (error, category) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!category) {
            res.status(404).json({ error: 'Genre not found' });
        } else {
            res.json(category);
        }
    });
});

router.post('/video-genre', (req, res) => {
    const { name, colorCode } = req.body;

    const genre: VideoGenre = {
        videoGenreId: 0,
        name,
        colorCode,
    };

    SystemRepository.AddVideoGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/video-genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const genre: VideoGenre = {
        videoGenreId: id,
        name,
        colorCode,
    };

    SystemRepository.UpdateVideoGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/video-genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    SystemRepository.DeleteVideoGenre(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.get('/video-service', (_, res) => {
    SystemRepository.GetAllVideoServices((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/video-service/:id', (req, res) => {
    const id = parseInt(req.params.id);

    SystemRepository.GetVideoServiceById(id, (error, category) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!category) {
            res.status(404).json({ error: 'Video service not found' });
        } else {
            res.json(category);
        }
    });
});

router.post('/video-service', (req, res) => {
    const { videoServiceId, name, colorCode } = req.body;

    const service: VideoService = {
        videoServiceId: parseInt(videoServiceId),
        name,
        colorCode,
    };

    SystemRepository.AddVideoService(service, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/video-service/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const service: VideoService = {
        videoServiceId: id,
        name,
        colorCode,
    };

    SystemRepository.UpdateVideoService(service, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/video-service/:id', (req, res) => {
    const id = parseInt(req.params.id);

    SystemRepository.DeleteVideoService(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;