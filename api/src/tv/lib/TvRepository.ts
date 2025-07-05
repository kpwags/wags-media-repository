import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
import calculateProgress from '../../lib/calculateProgress';

import {
    TvQueryReturn,
    TvGenreLinkQueryReturn,
    TvServiceLinkQueryReturn,
    getAllTelevisionShows,
    getTelevisionShowById,
    getCurrentTelevisionShows,
    insertTelevsionShow,
    updateTelevisionShow,
    deleteTelevisionShow,
    getAllTvGenreLinks,
    getAllTvServiceLinks,
    getGenresForTelevisionShow,
    getServicesForTelevisionShow,
    insertTvGenreLink,
    insertTvServiceLink,
    clearTvGenreLinks,
    clearTvServiceLinks,
    getLastInsertedId,
    updateTelevisionShowProgress,
} from './queries';

import { VideoService, VideoGenre } from '../../models/system';
import { VideoGenreQueryReturn, VideoServiceQueryReturn } from '@models/system';
import { TelevisionShowServiceLink, TelevisionShow, TelevisionShowGenreLink } from '../../models/tv';

class TvRepository {
    private static GetDatabase = () => {
        sqlite3.verbose();

        return new sqlite3.Database(config.db);
    };

    static readonly GetAllTelevisionShows = (callback: (error: string | null, televisionShows: TelevisionShow[]) => void) => {
        const db = this.GetDatabase();

        const tvShows: TelevisionShow[] = [];

        db.all(getAllTelevisionShows, (err: any, rows: TvQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                tvShows.push({
                    televisionShowId: row.TelevisionShowId,
                    statusId: row.TelevisionStatusId,
                    title: row.Title,
                    imdbLink: row.ImdbLink,
                    coverImageUrl: row.CoverImageUrl,
                    sortOrder: row.SortOrder,
                    seasonEpisodeCount: row.SeasonEpisodeCount,
                    currentSeasonEpisode: row.CurrentSeasonEpisode,
                    progress: calculateProgress(row.CurrentSeasonEpisode, row.SeasonEpisodeCount),
                    rating: row.Rating,
                    thoughts: row.Thoughts,
                    status: {
                        televisionStatusId: row.TelevisionStatusId,
                        name: row.TelevsionShowStatusName,
                        colorCode: row.TelevsionShowStatusColor,
                    },
                    genres: [],
                    services: [],
                });
            });

            return callback(null, tvShows);
        });
    };

    static readonly GetTelevisionShowById = (id: number, callback: (error: string | null, televisionShow: TelevisionShow | null) => void) => {
        const db = this.GetDatabase();

        db.get(getTelevisionShowById, [id], (err: any, row: TvQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                televisionShowId: row.TelevisionShowId,
                statusId: row.TelevisionStatusId,
                title: row.Title,
                imdbLink: row.ImdbLink,
                coverImageUrl: row.CoverImageUrl,
                sortOrder: row.SortOrder,
                seasonEpisodeCount: row.SeasonEpisodeCount,
                currentSeasonEpisode: row.CurrentSeasonEpisode,
                progress: calculateProgress(row.CurrentSeasonEpisode, row.SeasonEpisodeCount),
                rating: row.Rating,
                thoughts: row.Thoughts,
                status: {
                    televisionStatusId: row.TelevisionStatusId,
                    name: row.TelevsionShowStatusName,
                    colorCode: row.TelevsionShowStatusColor,
                },
                genres: [],
                services: [],
            });
        });
    };

    static readonly GetCurrentTelevisionShows = (callback: (error: string | null, televisionShows: TelevisionShow[]) => void) => {
        const db = this.GetDatabase();

        const tvShows: TelevisionShow[] = [];

        db.all(getCurrentTelevisionShows, (err: any, rows: TvQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                tvShows.push({
                    televisionShowId: row.TelevisionShowId,
                    statusId: row.TelevisionStatusId,
                    title: row.Title,
                    imdbLink: row.ImdbLink,
                    coverImageUrl: row.CoverImageUrl,
                    sortOrder: row.SortOrder,
                    seasonEpisodeCount: row.SeasonEpisodeCount,
                    currentSeasonEpisode: row.CurrentSeasonEpisode,
                    progress: calculateProgress(row.CurrentSeasonEpisode, row.SeasonEpisodeCount),
                    rating: row.Rating,
                    thoughts: row.Thoughts,
                    status: {
                        televisionStatusId: row.TelevisionStatusId,
                        name: row.TelevsionShowStatusName,
                        colorCode: row.TelevsionShowStatusColor,
                    },
                    genres: [],
                    services: [],
                });
            });

            return callback(null, tvShows);
        });
    };

    static readonly AddTelevisionShowGenreLinks = (genres: { televisionShowId: number, genreId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];

            db.run(insertTvGenreLink, [genre.televisionShowId, genre.genreId], function (err) {
                if (err) throw err;
            });
        }
    };

    static readonly AddTelevisionShowServiceLinks = (services: { televisionShowId: number, serviceId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < services.length; i++) {
            const service = services[i];

            db.run(insertTvServiceLink, [service.televisionShowId, service.serviceId], function (err) {
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

    static readonly AddTelevisionShow = (televsionShow: TelevisionShow, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertTelevsionShow, [
            televsionShow.imdbLink,
            televsionShow.statusId,
            televsionShow.coverImageUrl,
            televsionShow.rating,
            televsionShow.thoughts,
            televsionShow.title,
            televsionShow.sortOrder,
            televsionShow.seasonEpisodeCount,
            televsionShow.currentSeasonEpisode,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            try {
                this.GetLastInsertedId((error, televisionShowId) => {
                    if (error || !televisionShowId) {
                        return callback(error ?? 'Error retrieving last ID');
                    }

                    const genres = televsionShow.genres.map((g) => ({ televisionShowId, genreId: g.videoGenreId }));
                    const services = televsionShow.services.map((g) => ({ televisionShowId, serviceId: g.videoServiceId }));

                    this.AddTelevisionShowGenreLinks(genres);
                    this.AddTelevisionShowServiceLinks(services);
                });
            } catch (e) {
                return callback((e as Error).message);
            }

            return callback(null);
        });
    };

    static readonly UpdateTelevisionShow = (televisionShow: TelevisionShow, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateTelevisionShow, [
            televisionShow.imdbLink,
            televisionShow.statusId,
            televisionShow.coverImageUrl,
            televisionShow.rating,
            televisionShow.thoughts,
            televisionShow.title,
            televisionShow.sortOrder,
            televisionShow.seasonEpisodeCount,
            televisionShow.currentSeasonEpisode,
            televisionShow.televisionShowId,
        ], (err) => {
            if (err) {
                db.close();
                return callback(cleanSqliteError(err));
            }

            db.serialize(() => {
                db
                    .run(clearTvGenreLinks, [televisionShow.televisionShowId])
                    .run(clearTvServiceLinks, [televisionShow.televisionShowId], (error) => {
                        db.close();

                        if (error) {
                            return callback(cleanSqliteError(error));
                        }

                        const genres = televisionShow.genres.map((g) => ({ televisionShowId: televisionShow.televisionShowId, genreId: g.videoGenreId }));
                        const services = televisionShow.services.map((g) => ({ televisionShowId: televisionShow.televisionShowId, serviceId: g.videoServiceId }));

                        this.AddTelevisionShowGenreLinks(genres);
                        this.AddTelevisionShowServiceLinks(services);
                    });
            });

            return callback(null);
        });
    };

    static readonly DeleteTelevisionShow = (televisionShowId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.serialize(() => {
            db
                .run(clearTvGenreLinks, [televisionShowId])
                .run(clearTvServiceLinks, [televisionShowId])
                .run(deleteTelevisionShow, [televisionShowId], (err) => {
                    db.close();

                    if (err) {
                        return callback(cleanSqliteError(err));
                    }

                    return callback(null);
                });
        });
    };

    static readonly GetAllTelevisionGenreLinks = (callback: (error: string | null, genreLinks: TelevisionShowGenreLink[]) => void) => {
        const db = this.GetDatabase();

        const genreLinks: TelevisionShowGenreLink[] = [];

        db.all(getAllTvGenreLinks, (err: any, rows: TvGenreLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genreLinks.push({
                    televisionShowId: row.TelevisionShowId,
                    genreId: row.VideoGenreId,
                    genreName: row.VideoGenreName,
                    genreColorCode: row.VideoGenreColor,
                });
            });

            return callback(null, genreLinks);
        });
    };

    static readonly GetAllTelevisionServiceLinks = (callback: (error: string | null, genreLinks: TelevisionShowServiceLink[]) => void) => {
        const db = this.GetDatabase();

        const genreLinks: TelevisionShowServiceLink[] = [];

        db.all(getAllTvServiceLinks, (err: any, rows: TvServiceLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genreLinks.push({
                    televisionShowId: row.TelevisionShowId,
                    serviceId: row.VideoServiceId,
                    serviceName: row.VideoServiceName,
                    serviceColorCode: row.VideoServiceColor,
                });
            });

            return callback(null, genreLinks);
        });
    };

    static readonly GetGenresForTelevisionShow = (televisionShowId: number, callback: (error: string | null, genres: VideoGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: VideoGenre[] = [];

        db.all(getGenresForTelevisionShow, [televisionShowId], (err: any, rows: VideoGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    videoGenreId: row.VideoGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetServicesForTelevisionShow = (televisionShowId: number, callback: (error: string | null, genres: VideoService[]) => void) => {
        const db = this.GetDatabase();

        const services: VideoService[] = [];

        db.all(getServicesForTelevisionShow, [televisionShowId], (err: any, rows: VideoServiceQueryReturn[]) => {
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

    static readonly UpdateTelevisionShowProgress = (televisionShowId: number, currentSeasonEpisode: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateTelevisionShowProgress, [currentSeasonEpisode, televisionShowId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };
}

export default TvRepository;
