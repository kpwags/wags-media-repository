import express from 'express';

import { MovieRepository } from '@repositories/MovieRepository';

import { Movie } from '@models/movie';

const movieRouter = express.Router();

movieRouter.get('/recent/:days', (req, res) => {
    const limitInDays = parseInt(req.params.days);

    MovieRepository.GetRecentMovies(limitInDays)
        .then(([error, data]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.json(data);
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

movieRouter.get('/', (_, res) => {
    MovieRepository.GetAllMovies()
        .then(([error, data]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.json(data);
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

movieRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MovieRepository.GetMovieById(id)
        .then(([error, data]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            return res.json(data);
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

movieRouter.post('/', (req, res) => {
    const {
        title,
        imdbLink,
        posterImageUrl,
        dateWatched,
        rating,
        thoughts,
        sortOrder,
        statusId,
        genres,
        services,
    } = req.body;

    const movie: Movie = {
        movieId: 0,
        title,
        imdbLink,
        posterImageUrl,
        dateWatched,
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        sortOrder,
        statusId,
        genres: genres.map((g: number) => ({ videoGenreId: g, name: '', colorCode: '' })),
        services: services.map((s: number) => ({ videoServiceId: s, name: '', colorCode: '' })),
    };

    MovieRepository.AddMovie(movie)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.send();
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

movieRouter.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const {
        title,
        imdbLink,
        posterImageUrl,
        dateWatched,
        rating,
        thoughts,
        sortOrder,
        statusId,
        genres,
        services,
    } = req.body;

    const movie: Movie = {
        movieId: id,
        title,
        imdbLink,
        posterImageUrl,
        dateWatched,
        rating: rating ?? 0,
        thoughts: thoughts ?? '',
        sortOrder,
        statusId,
        genres: genres.map((g: number) => ({ videoGenreId: g, name: '', colorCode: '' })),
        services: services.map((s: number) => ({ videoServiceId: s, name: '', colorCode: '' })),
    };

    MovieRepository.UpdateMovie(movie)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.send();
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

movieRouter.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MovieRepository.DeleteMovie(id)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.send();
        }).catch((e) => {
            return res.status(400).json({ error: e });
        });
});

export { movieRouter };
