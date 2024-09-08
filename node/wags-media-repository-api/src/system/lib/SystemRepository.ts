import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
import {
    VideoServiceQueryReturn,
    VideoGenreQueryReturn,
    getAllVideoGenres,
    getVideoGenreById,
    insertVideoGenre,
    updateVideoGenre,
    deleteVideoGenre,
    getAllVideoServices,
    getVideoServiceById,
    insertVideoService,
    updateVideoService,
    deleteVideoService,
} from './queries';

import { VideoGenre, VideoService } from '../../models/system';

class SystemRepository {
    private static GetDatabase = () => new sqlite3.Database(config.db);

    static readonly GetAllVideoGenres = (callback: (error: string | null, genres: VideoGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: VideoGenre[] = [];

        db.all(getAllVideoGenres, (err: any, rows: VideoGenreQueryReturn[]) => {
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

    static readonly GetVideoGenreById = (id: number, callback: (error: string | null, genre: VideoGenre | null) => void) => {
        const db = this.GetDatabase();

        db.get(getVideoGenreById, [id], (err, row: VideoGenreQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                videoGenreId: row.VideoGenreId,
                name: row.Name,
                colorCode: row.ColorCode,
                movieCount: row.MovieCount,
            });
        });
    };

    static readonly AddVideoGenre = (genre: VideoGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertVideoGenre, [genre.name, genre.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateVideoGenre = (genre: VideoGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateVideoGenre, [
            genre.name,
            genre.colorCode,
            genre.videoGenreId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteVideoGenre = (videoGenreId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteVideoGenre, [videoGenreId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly GetAllVideoServices = (callback: (error: string | null, services: VideoService[]) => void) => {
        const db = this.GetDatabase();

        const services: VideoService[] = [];

        db.all(getAllVideoServices, (err: any, rows: VideoServiceQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                services.push({
                    videoServiceId: row.VideoServiceId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    tvShowCount: row.TvShowCount,
                    movieCount: row.MovieCount,
                });
            });

            return callback(null, services);
        });
    };

    static readonly GetVideoServiceById = (id: number, callback: (error: string | null, service: VideoService | null) => void) => {
        const db = this.GetDatabase();

        db.get(getVideoServiceById, [id], (err, row: VideoServiceQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                videoServiceId: row.VideoServiceId,
                name: row.Name,
                colorCode: row.ColorCode,
                tvShowCount: row.TvShowCount,
                movieCount: row.MovieCount,
            });
        });
    };

    static readonly AddVideoService = (service: VideoService, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertVideoService, [service.name, service.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateVideoService = (service: VideoService, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateVideoService, [
            service.name,
            service.colorCode,
            service.videoServiceId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteVideoService = (videoServiceId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteVideoService, [videoServiceId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };
}

export default SystemRepository;
