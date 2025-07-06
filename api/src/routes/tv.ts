import express from 'express';

import { TvRepository } from '@repositories/TvRepository';

import { TelevisionShow } from '@models/tv';

const tvRouter = express.Router();

tvRouter.put('/update-progress/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { currentSeasonEpisode } = req.body;

    TvRepository.UpdateTelevisionShowProgress(id, currentSeasonEpisode)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.send();
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

tvRouter.get('/current', (_, res) => {
    TvRepository.GetCurrentTelevisionShows()
        .then(([error, tvShows]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.json(tvShows);
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

tvRouter.get('/', (_, res) => {
    TvRepository.GetAllTelevisionShows()
        .then(([error, tvShows]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.json(tvShows);
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

tvRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    TvRepository.GetTelevisionShowById(id)
        .then(([error, data]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (!data) {
                return res.status(404).json({ error: 'TV show not found' });
            } else {
                return res.json(data);
            }
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

tvRouter.post('/', (req, res) => {
    const {
        title,
        imdbLink,
        coverImageUrl,
        rating,
        thoughts,
        sortOrder,
        statusId,
        currentSeasonEpisode,
        seasonEpisodeCount,
        genres,
        services,
    } = req.body;

    const televisionShow: TelevisionShow = {
        televisionShowId: 0,
        title,
        imdbLink,
        coverImageUrl: coverImageUrl ?? '',
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        sortOrder,
        statusId,
        currentSeasonEpisode,
        seasonEpisodeCount,
        progress: 0,
        genres: genres.map((g: number) => ({ videoGenreId: g, name: '', colorCode: '' })),
        services: services.map((s: number) => ({ videoServiceId: s, name: '', colorCode: '' })),
    };

    TvRepository.AddTelevisionShow(televisionShow)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.send();
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

tvRouter.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const {
        title,
        imdbLink,
        coverImageUrl,
        rating,
        thoughts,
        sortOrder,
        statusId,
        currentSeasonEpisode,
        seasonEpisodeCount,
        genres,
        services,
    } = req.body;

    const televisionShow: TelevisionShow = {
        televisionShowId: id,
        title,
        imdbLink,
        coverImageUrl,
        currentSeasonEpisode,
        seasonEpisodeCount,
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        sortOrder,
        statusId,
        progress: 0,
        genres: genres.map((g: number) => ({ videoGenreId: g, name: '', colorCode: '' })),
        services: services.map((s: number) => ({ videoServiceId: s, name: '', colorCode: '' })),
    };

    TvRepository.UpdateTelevisionShow(televisionShow)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.send();
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

tvRouter.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    TvRepository.DeleteTelevisionShow(id)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.send();
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

export { tvRouter };
