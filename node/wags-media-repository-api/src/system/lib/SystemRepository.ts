import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
import {
    VideoServiceQueryReturn,
    getAllVideoServices,
    getVideoServiceById,
    insertVideoService,
    updateVideoService,
    deleteVideoService,
} from './queries';

import { VideoService } from '../../models/system';

class SystemRepository {
    private static GetDatabase = () => new sqlite3.Database(config.db);

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
