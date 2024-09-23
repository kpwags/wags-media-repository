import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';

import {
    VideoGameQueryReturn,
    VideoGameGenreQueryReturn,
    VideoGameSystemQueryReturn,
    VideoGameGenreLinkQueryReturn,
    VideoGameSystemLinkQueryReturn,
    getAllVideoGames,
    getVideoGameById,
    insertVideoGame,
    updateVideoGame,
    deleteVideoGame,
    getAllVideoGameGenreLinks,
    getAllVideoGameSystemLinks,
    getGenresForVideoGame,
    getSystemsForVideoGame,
    clearVideoGameGenreLinks,
    clearVideoGameSystemLinks,
    insertVideoGameGenreLink,
    insertVideoGameSystemLink,
    getLastInsertedId,
    getAllVideoGameGenres,
    getVideoGameGenreById,
    insertVideoGameGenre,
    updateVideoGameGenre,
    deleteVideoGameGenre,
    getAllVideoGameSystems,
    getVideoGameSystemById,
    insertVideoGameSystem,
    updateVideoGameSystem,
    deleteVideoGameSystem,
    getCurrentVideoGames,
} from './queries';

import {
    VideoGame,
    VideoGameGenre,
    VideoGameSystem,
    VideoGameGenreLink,
    VideoGameSystemLink,
} from '../../models/videoGame';

class VideoGameRepository {
    private static GetDatabase = () => {
        sqlite3.verbose();

        return new sqlite3.Database(config.db);
    };

    static readonly GetAllVideoGames = (callback: (error: string | null, videoGames: VideoGame[]) => void) => {
        const db = this.GetDatabase();

        const videoGames: VideoGame[] = [];

        db.all(getAllVideoGames, (err: any, rows: VideoGameQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                videoGames.push({
                    videoGameId: row.VideoGameId,
                    videoGameStatusId: row.VideoGameStatusId,
                    videoGameCompletionId: row.VideoGameCompletionId,
                    title: row.Title,
                    link: row.Link,
                    dateStarted: row.DateStarted,
                    dateCompleted: row.DateCompleted,
                    coverImageUrl: row.CoverImageUrl,
                    sortOrder: row.SortOrder,
                    rating: row.Rating,
                    thoughts: row.Thoughts,
                    status: {
                        videoGameStatusId: row.VideoGameStatusId,
                        name: row.VideoGameStatusName,
                        colorCode: row.VideoGameStatusColor,
                    },
                    completion: {
                        videoGameCompletionId: row.VideoGameCompletionId,
                        name: row.VideoGameCompletionName,
                        colorCode: row.VideoGameCompletionColor,
                    },
                    genres: [],
                    systems: [],
                });
            });

            return callback(null, videoGames);
        });
    };

    static readonly GetCurrentVideoGames = (callback: (error: string | null, videoGames: VideoGame[]) => void) => {
        const db = this.GetDatabase();

        const videoGames: VideoGame[] = [];

        db.all(getCurrentVideoGames, (err: any, rows: VideoGameQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                videoGames.push({
                    videoGameId: row.VideoGameId,
                    videoGameStatusId: row.VideoGameStatusId,
                    videoGameCompletionId: row.VideoGameCompletionId,
                    title: row.Title,
                    link: row.Link,
                    dateStarted: row.DateStarted,
                    dateCompleted: row.DateCompleted,
                    coverImageUrl: row.CoverImageUrl,
                    sortOrder: row.SortOrder,
                    rating: row.Rating,
                    thoughts: row.Thoughts,
                    status: {
                        videoGameStatusId: row.VideoGameStatusId,
                        name: row.VideoGameStatusName,
                        colorCode: row.VideoGameStatusColor,
                    },
                    completion: {
                        videoGameCompletionId: row.VideoGameCompletionId,
                        name: row.VideoGameCompletionName,
                        colorCode: row.VideoGameCompletionColor,
                    },
                    genres: [],
                    systems: [],
                });
            });

            return callback(null, videoGames);
        });
    };

    static readonly GetVideoGameById = (id: number, callback: (error: string | null, videoGame: VideoGame | null) => void) => {
        const db = this.GetDatabase();

        db.get(getVideoGameById, [id], (err: any, row: VideoGameQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                videoGameId: row.VideoGameId,
                videoGameStatusId: row.VideoGameStatusId,
                videoGameCompletionId: row.VideoGameCompletionId,
                title: row.Title,
                link: row.Link,
                dateStarted: row.DateStarted,
                dateCompleted: row.DateCompleted,
                coverImageUrl: row.CoverImageUrl,
                sortOrder: row.SortOrder,
                rating: row.Rating,
                thoughts: row.Thoughts,
                status: {
                    videoGameStatusId: row.VideoGameStatusId,
                    name: row.VideoGameStatusName,
                    colorCode: row.VideoGameStatusColor,
                },
                completion: {
                    videoGameCompletionId: row.VideoGameCompletionId,
                    name: row.VideoGameCompletionName,
                    colorCode: row.VideoGameCompletionColor,
                },
                genres: [],
                systems: [],
            });
        });
    };

    static readonly AddVideoGameGenreLinks = (genres: { videoGameId: number, genreId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];

            db.run(insertVideoGameGenreLink, [genre.videoGameId, genre.genreId], function (err) {
                if (err) throw err;
            });
        }
    };

    static readonly AddVideoGameSystemLinks = (systems: { videoGameId: number, systemId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < systems.length; i++) {
            const system = systems[i];

            db.run(insertVideoGameSystemLink, [system.videoGameId, system.systemId], function (err) {
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

    static readonly AddVideoGame = (videoGame: VideoGame, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertVideoGame, [
            videoGame.videoGameStatusId,
            videoGame.videoGameCompletionId,
            videoGame.title,
            videoGame.link,
            videoGame.dateStarted,
            videoGame.dateCompleted,
            videoGame.rating,
            videoGame.thoughts,
            videoGame.coverImageUrl,
            videoGame.sortOrder,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            try {
                this.GetLastInsertedId((error, videoGameId) => {
                    if (error || !videoGameId) {
                        return callback(error ?? 'Error retrieving last ID');
                    }

                    const genres = videoGame.genres.map((g) => ({ videoGameId, genreId: g.videoGameGenreId }));
                    const systems = videoGame.systems.map((g) => ({ videoGameId, systemId: g.videoGameSystemId }));

                    this.AddVideoGameGenreLinks(genres);
                    this.AddVideoGameSystemLinks(systems);
                });
            } catch (e) {
                return callback((e as Error).message);
            }

            return callback(null);
        });
    };

    static readonly UpdateVideoGame = (videoGame: VideoGame, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateVideoGame, [
            videoGame.videoGameStatusId,
            videoGame.videoGameCompletionId,
            videoGame.title,
            videoGame.link,
            videoGame.dateStarted,
            videoGame.dateCompleted,
            videoGame.rating,
            videoGame.thoughts,
            videoGame.coverImageUrl,
            videoGame.sortOrder,
            videoGame.videoGameId,
        ], (err) => {
            if (err) {
                db.close();
                return callback(cleanSqliteError(err));
            }

            db.serialize(() => {
                db
                    .run(clearVideoGameGenreLinks, [videoGame.videoGameId])
                    .run(clearVideoGameSystemLinks, [videoGame.videoGameId], (error) => {
                        db.close();

                        if (error) {
                            return callback(cleanSqliteError(error));
                        }

                        const genres = videoGame.genres.map((g) => ({ videoGameId: videoGame.videoGameId, genreId: g.videoGameGenreId }));
                        const systems = videoGame.systems.map((s) => ({ videoGameId: videoGame.videoGameId, systemId: s.videoGameSystemId }));

                        this.AddVideoGameGenreLinks(genres);
                        this.AddVideoGameSystemLinks(systems);
                    });
            });

            return callback(null);
        });
    };

    static readonly DeleteVideoGame = (videoGameId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.serialize(() => {
            db
                .run(clearVideoGameGenreLinks, [videoGameId])
                .run(clearVideoGameSystemLinks, [videoGameId])
                .run(deleteVideoGame, [videoGameId], (err) => {
                    db.close();

                    if (err) {
                        return callback(cleanSqliteError(err));
                    }

                    return callback(null);
                });
        });
    };

    static readonly GetAllVideoGameGenreLinks = (callback: (error: string | null, genreLinks: VideoGameGenreLink[]) => void) => {
        const db = this.GetDatabase();

        const genreLinks: VideoGameGenreLink[] = [];

        db.all(getAllVideoGameGenreLinks, (err: any, rows: VideoGameGenreLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genreLinks.push({
                    videoGameId: row.VideoGameId,
                    genreId: row.VideoGameGenreId,
                    genreName: row.VideoGameGenreName,
                    genreColorCode: row.VideoGameGenreColor,
                });
            });

            return callback(null, genreLinks);
        });
    };

    static readonly GetAllVideoGameSystemLinks = (callback: (error: string | null, systemLinks: VideoGameSystemLink[]) => void) => {
        const db = this.GetDatabase();

        const systemLinks: VideoGameSystemLink[] = [];

        db.all(getAllVideoGameSystemLinks, (err: any, rows: VideoGameSystemLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                systemLinks.push({
                    videoGameId: row.VideoGameId,
                    systemId: row.VideoGameSystemId,
                    systemName: row.VideoGameSystemName,
                    systemColorCode: row.VideoGameSystemColor,
                });
            });

            return callback(null, systemLinks);
        });
    };

    static readonly GetGenresForVideoGame = (videoGameId: number, callback: (error: string | null, genres: VideoGameGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: VideoGameGenre[] = [];

        db.all(getGenresForVideoGame, [videoGameId], (err: any, rows: VideoGameGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    videoGameGenreId: row.VideoGameGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetSystemsForVideoGame = (videoGameId: number, callback: (error: string | null, systems: VideoGameSystem[]) => void) => {
        const db = this.GetDatabase();

        const systems: VideoGameSystem[] = [];

        db.all(getSystemsForVideoGame, [videoGameId], (err: any, rows: VideoGameSystemQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                systems.push({
                    videoGameSystemId: row.VideoGameSystemId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                });
            });

            return callback(null, systems);
        });
    };

    static readonly GetAllVideoGameGenres = (callback: (error: string | null, genres: VideoGameGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: VideoGameGenre[] = [];

        db.all(getAllVideoGameGenres, (err: any, rows: VideoGameGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    videoGameGenreId: row.VideoGameGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    videoGameCount: row.VideoGameCount,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetVideoGameGenreById = (id: number, callback: (error: string | null, genre: VideoGameGenre | null) => void) => {
        const db = this.GetDatabase();

        db.get(getVideoGameGenreById, [id], (err, row: VideoGameGenreQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                videoGameGenreId: row.VideoGameGenreId,
                name: row.Name,
                colorCode: row.ColorCode,
                videoGameCount: row.VideoGameCount,
            });
        });
    };

    static readonly AddVideoGameGenre = (genre: VideoGameGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertVideoGameGenre, [genre.name, genre.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateVideoGameGenre = (genre: VideoGameGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateVideoGameGenre, [
            genre.name,
            genre.colorCode,
            genre.videoGameGenreId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteVideoGameGenre = (genreId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteVideoGameGenre, [genreId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly GetAllVideoGameSystems = (callback: (error: string | null, systems: VideoGameSystem[]) => void) => {
        const db = this.GetDatabase();

        const systems: VideoGameSystem[] = [];

        db.all(getAllVideoGameSystems, (err: any, rows: VideoGameSystemQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                systems.push({
                    videoGameSystemId: row.VideoGameSystemId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    videoGameCount: row.VideoGameCount,
                });
            });

            return callback(null, systems);
        });
    };

    static readonly GetVideoGameSystemById = (id: number, callback: (error: string | null, system: VideoGameSystem | null) => void) => {
        const db = this.GetDatabase();

        db.get(getVideoGameSystemById, [id], (err, row: VideoGameSystemQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                videoGameSystemId: row.VideoGameSystemId,
                name: row.Name,
                colorCode: row.ColorCode,
                videoGameCount: row.VideoGameCount,
            });
        });
    };

    static readonly AddVideoGameSystem = (system: VideoGameSystem, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertVideoGameSystem, [system.name, system.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateVideoGameSystem = (system: VideoGameSystem, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateVideoGameSystem, [
            system.name,
            system.colorCode,
            system.videoGameSystemId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteVideoGameSystem = (genreId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteVideoGameSystem, [genreId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };
};

export default VideoGameRepository;
