import express from 'express';

import TvRepository from './lib/TvRepository';

import { TelevisionShow } from '../models/tv';

const router = express.Router();

router.put('/update-progress/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { currentSeasonEpisode } = req.body;

    TvRepository.UpdateTelevisionShowProgress(id, currentSeasonEpisode, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.get('/current', (_, res) => {
    TvRepository.GetAllTelevisionGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        TvRepository.GetAllTelevisionServiceLinks((serviceLinkError, serviceLinks) => {
            if (serviceLinkError) {
                return res.status(400).json({ serviceLinkError });
            }

            TvRepository.GetCurrentTelevisionShows((error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const tvShows: TelevisionShow[] = [];

                data.forEach((tv) => {
                    tv.genres = genreLinks
                        .filter((g) => g.televisionShowId == tv.televisionShowId)
                        .map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    tv.services = serviceLinks
                        .filter((s) => s.televisionShowId == tv.televisionShowId)
                        .map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode }));

                    tvShows.push(tv);
                });

                res.json(tvShows);
            });
        });
    });
});

router.get('/', (_, res) => {
    TvRepository.GetAllTelevisionGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        TvRepository.GetAllTelevisionServiceLinks((serviceLinkError, serviceLinks) => {
            if (serviceLinkError) {
                return res.status(400).json({ serviceLinkError });
            }

            TvRepository.GetAllTelevisionShows((error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const tvShows: TelevisionShow[] = [];

                data.forEach((tv) => {
                    tv.genres = genreLinks
                        .filter((g) => g.televisionShowId == tv.televisionShowId)
                        .map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    tv.services = serviceLinks
                        .filter((s) => s.televisionShowId == tv.televisionShowId)
                        .map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode }));

                    tvShows.push(tv);
                });

                res.json(tvShows);
            });
        });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    TvRepository.GetServicesForTelevisionShow(id, (serviceError, services) => {
        if (serviceError) {
            return res.status(400).json({ serviceError });
        }

        TvRepository.GetGenresForTelevisionShow(id, (genreError, genres) => {
            if (genreError) {
                return res.status(400).json({ genreError });
            }

            TvRepository.GetTelevisionShowById(id, (error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                if (!data) {
                    res.status(404).json({ error: 'TV show not found' });
                } else {
                    res.json({
                        ...data,
                        genres,
                        services,
                    });
                }
            });
        });
    });
});

router.post('/', (req, res) => {
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
        coverImageUrl,
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

    TvRepository.AddTelevisionShow(televisionShow, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/:id', (req, res) => {
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

    TvRepository.UpdateTelevisionShow(televisionShow, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    TvRepository.DeleteTelevisionShow(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;
