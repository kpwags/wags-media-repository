import express from 'express';

import systemRepository from './lib/SystemRepository';
import { VideoService } from '../models/system';

const router = express.Router();

router.get('/video-services', (_, res) => {
    systemRepository.GetAllVideoServices((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/video-services/:id', (req, res) => {
    const id = parseInt(req.params.id);

    systemRepository.GetVideoServiceById(id, (error, category) => {
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

router.post('/video-services', (req, res) => {
    const { videoServiceId, name, colorCode } = req.body;

    const service: VideoService = {
        videoServiceId: parseInt(videoServiceId),
        name,
        colorCode,
    };

    systemRepository.AddVideoService(service, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/video-services/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const service: VideoService = {
        videoServiceId: id,
        name,
        colorCode,
    };

    systemRepository.UpdateVideoService(service, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/video-services/:id', (req, res) => {
    const id = parseInt(req.params.id);

    systemRepository.DeleteVideoService(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;