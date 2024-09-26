import express from 'express';

import MovieRepository from './lib/MovieRepository';

import { Movie } from '../models/movie';

const router = express.Router();

router.get('/recent/:days', (req, res) => {
    const limitInDays = parseInt(req.params.days);

    MovieRepository.GetAllMovieGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        MovieRepository.GetAllMovieServiceLinks((serviceLinkError, serviceLinks) => {
            if (genreLinkError) {
                return res.status(400).json({ serviceLinkError });
            }

            MovieRepository.GetRecentMovies(limitInDays, (error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const movies: Movie[] = [];

                data.forEach((m) => {
                    m.genres = genreLinks
                        .filter((g) => g.movieId == m.movieId)
                        .map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    m.services = serviceLinks
                        .filter((s) => s.movieId == m.movieId)
                        .map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode }));

                    movies.push(m);
                });

                res.json(movies);
            });
        });
    });
});

router.get('/', (_, res) => {
    MovieRepository.GetAllMovieGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ genreLinkError });
        }

        MovieRepository.GetAllMovieServiceLinks((serviceLinkError, serviceLinks) => {
            if (genreLinkError) {
                return res.status(400).json({ serviceLinkError });
            }

            MovieRepository.GetAllMovies((error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                const movies: Movie[] = [];

                data.forEach((m) => {
                    m.genres = genreLinks
                        .filter((g) => g.movieId == m.movieId)
                        .map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                    m.services = serviceLinks
                        .filter((s) => s.movieId == m.movieId)
                        .map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode }));

                    movies.push(m);
                });

                res.json(movies);
            });
        });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MovieRepository.GetServicesForMovie(id, (serviceError, services) => {
        if (serviceError) {
            return res.status(400).json({ serviceError });
        }

        MovieRepository.GetGenresForMovie(id, (genreError, genres) => {
            if (genreError) {
                return res.status(400).json({ genreError });
            }

            MovieRepository.GetMovieById(id, (error, data) => {
                if (error) {
                    return res.status(400).json({ error });
                }

                if (!data) {
                    res.status(404).json({ error: 'Movie not found' });
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

    MovieRepository.AddMovie(movie, (error) => {
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

    MovieRepository.UpdateMovie(movie, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MovieRepository.DeleteMovie(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;
