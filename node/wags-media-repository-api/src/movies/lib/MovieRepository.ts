import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
import { Movie, MovieGenreLink, MovieServiceLink } from '../../models/movie';
import {
    MovieQueryReturn,
    MovieGenreLinkQueryReturn,
    getAllMovies,
    getGenresForMovie,
    getAllMovieGenreLinks,
    getAllMovieServiceLinks,
    MovieServiceLinkQueryReturn,
    getMovieById,
    getServicesForMovie,
    insertMovieServiceLink,
    insertMovieGenreLink,
    insertMovie,
    getLastInsertedId,
    clearMovieGenreLinks,
    clearMovieServiceLinks,
    deleteMovie,
    updateMovie,
} from './queries';
import { VideoService, VideoGenre } from '../../models/system';
import { VideoGenreQueryReturn, VideoServiceQueryReturn } from '../../system/lib/queries';

class MovieRepository {
    private static GetDatabase = () => {
        sqlite3.verbose();

        return new sqlite3.Database(config.db);
    };

    static readonly GetGenresForMovie = (movieId: number, callback: (error: string | null, genres: VideoGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: VideoGenre[] = [];

        db.all(getGenresForMovie, [movieId], (err: any, rows: VideoGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    videoGenreId: row.VideoGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    movieCount: row.MovieCount,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetServicesForMovie = (movieId: number, callback: (error: string | null, genres: VideoService[]) => void) => {
        const db = this.GetDatabase();

        const services: VideoService[] = [];

        db.all(getServicesForMovie, [movieId], (err: any, rows: VideoServiceQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                services.push({
                    videoServiceId: row.VideoServiceId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                });
            });

            return callback(null, services);
        });
    };

    static readonly GetAllMovieGenreLinks = (callback: (error: string | null, genreLinks: MovieGenreLink[]) => void) => {
        const db = this.GetDatabase();

        const genreLinks: MovieGenreLink[] = [];

        db.all(getAllMovieGenreLinks, (err: any, rows: MovieGenreLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genreLinks.push({
                    movieId: row.MovieId,
                    genreId: row.VideoGenreId,
                    genreName: row.VideoGenreName,
                    genreColorCode: row.VideoGenreColor,
                });
            });

            return callback(null, genreLinks);
        });
    };

    static readonly GetAllMovieServiceLinks = (callback: (error: string | null, genreLinks: MovieServiceLink[]) => void) => {
        const db = this.GetDatabase();

        const genreLinks: MovieServiceLink[] = [];

        db.all(getAllMovieServiceLinks, (err: any, rows: MovieServiceLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genreLinks.push({
                    movieId: row.MovieId,
                    serviceId: row.VideoServiceId,
                    serviceName: row.VideoServiceName,
                    serviceColorCode: row.VideoServiceColor,
                });
            });

            return callback(null, genreLinks);
        });
    };

    static readonly GetAllMovies = (callback: (error: string | null, movies: Movie[]) => void) => {
        const db = this.GetDatabase();

        const movies: Movie[] = [];

        db.all(getAllMovies, (err: any, rows: MovieQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                movies.push({
                    movieId: row.MovieId,
                    statusId: row.MovieStatusId,
                    title: row.Title,
                    imdbLink: row.ImdbLink,
                    posterImageUrl: row.PosterImageUrl,
                    dateWatched: row.DateWatched,
                    rating: row.Rating,
                    thoughts: row.Thoughts,
                    sortOrder: row.SortOrder,
                    status: {
                        movieStatusId: row.MovieStatusId,
                        name: row.MovieStatusName,
                        colorCode: row.MovieStatusColor,
                    },
                    genres: [],
                    services: [],
                });
            });

            return callback(null, movies);
        });
    };

    static readonly GetMovieById = (id: number, callback: (error: string | null, movie: Movie | null) => void) => {
        const db = this.GetDatabase();

        db.get(getMovieById, [id], (err: any, row: MovieQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                movieId: row.MovieId,
                statusId: row.MovieStatusId,
                title: row.Title,
                imdbLink: row.ImdbLink,
                posterImageUrl: row.PosterImageUrl,
                dateWatched: row.DateWatched,
                rating: row.Rating,
                thoughts: row.Thoughts,
                sortOrder: row.SortOrder,
                status: {
                    movieStatusId: row.MovieStatusId,
                    name: row.MovieStatusName,
                    colorCode: row.MovieStatusColor,
                },
                genres: [],
                services: [],
            });
        });
    };

    static readonly AddMovieGenreLinks = (genres: { movieId: number, genreId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];

            db.run(insertMovieGenreLink, [genre.movieId, genre.genreId], function (err) {
                if (err) throw err;
            });
        }
    };

    static readonly AddMovieServiceLinks = (services: { movieId: number, serviceId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < services.length; i++) {
            const service = services[i];

            db.run(insertMovieServiceLink, [service.movieId, service.serviceId], function (err) {
                if (err) throw err;
            });
        }
    };

    static readonly GetLastInsertedId = (callback: (error: string | null, id: number | null) => void) => {
        const db = this.GetDatabase();

        db.get(getLastInsertedId, (err: any, row: { LastInsertedId: number }) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            return callback(null, row.LastInsertedId);
        });
    };

    static readonly AddMovie = (movie: Movie, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertMovie, [
            movie.statusId,
            movie.title,
            movie.imdbLink,
            movie.posterImageUrl,
            movie.dateWatched,
            movie.rating,
            movie.thoughts,
            movie.sortOrder
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            try {
                this.GetLastInsertedId((error, movieId) => {
                    if (error || !movieId) {
                        return callback(error ?? 'Error retrieving last ID');
                    }

                    const genres = movie.genres.map((g) => ({ movieId, genreId: g.videoGenreId }));
                    const services = movie.services.map((g) => ({ movieId, serviceId: g.videoServiceId }));

                    this.AddMovieGenreLinks(genres);
                    this.AddMovieServiceLinks(services);
                });
            } catch (e) {
                return callback((e as Error).message);
            }

            return callback(null);
        });
    };

    static readonly UpdateMovie = (movie: Movie, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateMovie, [
            movie.statusId,
            movie.title,
            movie.imdbLink,
            movie.posterImageUrl,
            movie.dateWatched,
            movie.rating,
            movie.thoughts,
            movie.sortOrder,
            movie.movieId,
        ], (err) => {
            if (err) {
                db.close();
                return callback(cleanSqliteError(err));
            }

            db.serialize(() => {
                db
                    .run(clearMovieGenreLinks, [movie.movieId])
                    .run(clearMovieServiceLinks, [movie.movieId], (error) => {
                        db.close();

                        if (error) {
                            return callback(cleanSqliteError(error));
                        }

                        const genres = movie.genres.map((g) => ({ movieId: movie.movieId, genreId: g.videoGenreId }));
                        const services = movie.services.map((g) => ({ movieId: movie.movieId, serviceId: g.videoServiceId }));

                        this.AddMovieGenreLinks(genres);
                        this.AddMovieServiceLinks(services);
                    });
            });

            return callback(null);
        });
    };

    static readonly DeleteMovie = (movieId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.serialize(() => {
            db
                .run(clearMovieGenreLinks, [movieId])
                .run(clearMovieServiceLinks, [movieId])
                .run(deleteMovie, [movieId], (err) => {
                    db.close();

                    if (err) {
                        return callback(cleanSqliteError(err));
                    }

                    return callback(null);
                });
        });
    };
}

export default MovieRepository;
