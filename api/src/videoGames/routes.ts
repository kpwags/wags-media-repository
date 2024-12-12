import express from 'express';

import VideoGameRepository from './lib/VideoGameRepository';

import { VideoGame, VideoGameGenre, VideoGameSystem } from '../models/videoGame';

const router = express.Router();

router.get('/genre', (_, res) => {
    VideoGameRepository.GetAllVideoGameGenres((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    VideoGameRepository.GetVideoGameGenreById(id, (error, genre) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!genre) {
            res.status(404).json({ error: 'Genre not found' });
        } else {
            res.json(genre);
        }
    });
});

router.post('/genre', (req, res) => {
    const { videoGameGenreId, name, colorCode } = req.body;

    const genre: VideoGameGenre = {
        videoGameGenreId: parseInt(videoGameGenreId),
        name,
        colorCode,
    };

    VideoGameRepository.AddVideoGameGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const genre: VideoGameGenre = {
        videoGameGenreId: id,
        name,
        colorCode,
    };

    VideoGameRepository.UpdateVideoGameGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    VideoGameRepository.DeleteVideoGameGenre(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.get('/system', (_, res) => {
    VideoGameRepository.GetAllVideoGameSystems((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/system/:id', (req, res) => {
    const id = parseInt(req.params.id);

    VideoGameRepository.GetVideoGameSystemById(id, (error, genre) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (!genre) {
            res.status(404).json({ error: 'System not found' });
        } else {
            res.json(genre);
        }
    });
});

router.post('/system', (req, res) => {
    const { videoGameSystemId, name, colorCode } = req.body;

    const system: VideoGameSystem = {
        videoGameSystemId: parseInt(videoGameSystemId),
        name,
        colorCode,
    };

    VideoGameRepository.AddVideoGameSystem(system, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/system/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const system: VideoGameSystem = {
        videoGameSystemId: id,
        name,
        colorCode,
    };

    VideoGameRepository.UpdateVideoGameSystem(system, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/system/:id', (req, res) => {
    const id = parseInt(req.params.id);

    VideoGameRepository.DeleteVideoGameSystem(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.get('/current', (_, res) => {
    VideoGameRepository.GetAllVideoGameGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        VideoGameRepository.GetAllVideoGameSystemLinks((systemLinkError, systemLinks) => {
            if (systemLinkError) {
                return res.status(400).json({ systemLinkError });
            }

            VideoGameRepository.GetCurrentVideoGames((error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const videoGames: VideoGame[] = [];

                data.forEach((game) => {
                    game.genres = genreLinks
                        .filter((g) => g.videoGameId == game.videoGameId)
                        .map((g) => ({ videoGameGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    game.systems = systemLinks
                        .filter((s) => s.videoGameId == game.videoGameId)
                        .map((s) => ({ videoGameSystemId: s.systemId, name: s.systemName, colorCode: s.systemColorCode }));

                    videoGames.push(game);
                });

                res.json(videoGames);
            });
        });
    });
});

router.get('/', (_, res) => {
    VideoGameRepository.GetAllVideoGameGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        VideoGameRepository.GetAllVideoGameSystemLinks((systemLinkError, systemLinks) => {
            if (systemLinkError) {
                return res.status(400).json({ systemLinkError });
            }

            VideoGameRepository.GetAllVideoGames((error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const videoGames: VideoGame[] = [];

                data.forEach((game) => {
                    game.genres = genreLinks
                        .filter((g) => g.videoGameId == game.videoGameId)
                        .map((g) => ({ videoGameGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    game.systems = systemLinks
                        .filter((s) => s.videoGameId == game.videoGameId)
                        .map((s) => ({ videoGameSystemId: s.systemId, name: s.systemName, colorCode: s.systemColorCode }));

                    videoGames.push(game);
                });

                res.json(videoGames);
            });
        });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    VideoGameRepository.GetGenresForVideoGame(id, (genreError, genres) => {
        if (genreError) {
            return res.status(400).json({ genreError });
        }

        VideoGameRepository.GetSystemsForVideoGame(id, (systemError, systems) => {
            if (systemError) {
                return res.status(400).json({ systemError });
            }

            VideoGameRepository.GetVideoGameById(id, (error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                if (!data) {
                    res.status(404).json({ error: 'Video game not found' });
                } else {
                    res.json({
                        ...data,
                        genres,
                        systems,
                    });
                }
            });
        });
    });
});

router.post('/', (req, res) => {
    const {
        videoGameStatusId,
        videoGameCompletionId,
        title,
        link,
        dateStarted,
        dateCompleted,
        rating,
        thoughts,
        coverImageUrl,
        sortOrder,
        genres,
        systems,
    } = req.body;

    const videoGame: VideoGame = {
        videoGameId: 0,
        videoGameStatusId,
        videoGameCompletionId,
        title,
        link,
        dateStarted,
        dateCompleted,
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        coverImageUrl: coverImageUrl ?? '',
        sortOrder,
        genres: genres.map((g: number) => ({ videoGameGenreId: g, name: '', colorCode: '' })),
        systems: systems.map((s: number) => ({ videoGameSystemId: s, name: '', colorCode: '' })),
    };

    VideoGameRepository.AddVideoGame(videoGame, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const {
        videoGameStatusId,
        videoGameCompletionId,
        title,
        link,
        dateStarted,
        dateCompleted,
        rating,
        thoughts,
        coverImageUrl,
        sortOrder,
        genres,
        systems,
    } = req.body;

    const videoGame: VideoGame = {
        videoGameId: id,
        videoGameStatusId,
        videoGameCompletionId,
        title,
        link,
        dateStarted,
        dateCompleted,
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        coverImageUrl: coverImageUrl ?? '',
        sortOrder,
        genres: genres.map((g: number) => ({ videoGameGenreId: g, name: '', colorCode: '' })),
        systems: systems.map((s: number) => ({ videoGameSystemId: s, name: '', colorCode: '' })),
    };

    VideoGameRepository.UpdateVideoGame(videoGame, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    VideoGameRepository.DeleteVideoGame(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;
