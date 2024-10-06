import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
import convertToBoolean from '../../lib/convertToBoolean';

import {
    MusicAlbum,
    MusicFormat,
    AlbumTrack,
    MusicFormatLink,
    MusicGenre,
    MusicGenreLink,
} from '../../models/music';

import {
    AlbumTrackQueryReturn,
    MusicAlbumQueryReturn,
    MusicFormatLinkQueryReturn,
    MusicFormatQueryReturn,
    MusicGenreLinkQueryReturn,
    MusicGenreQueryReturn,
    clearMusicAlbumFormatLinks,
    clearMusicAlbumGenreLinks,
    clearTracksFromAlbum,
    deleteMusicAlbum,
    deleteMusicGenre,
    getAllMusicAlbums,
    getAllMusicFormatLinks,
    getAllMusicGenreLinks,
    getAllMusicGenres,
    getAllTracks,
    getFormatsForMusicAlbum,
    getGenresForMusicAlbum,
    getLastInsertedId,
    getMusicAlbumById,
    getMusicGenreById,
    getTracksForAlbum,
    insertMusicAlbum,
    insertMusicAlbumGenreLink,
    insertMusicAlbumFormatLink,
    insertMusicGenre,
    updateMusicAlbum,
    updateMusicGenre,
    insertAlbumTrack,
    getMusicAlbumsOnNowPage,
} from './queries';

class MusicRepository {
    private static readonly GetDatabase = () => {
        sqlite3.verbose();

        return new sqlite3.Database(config.db);
    };

    static readonly GetAllMusicAlbums = (callback: (error: string | null, albums: MusicAlbum[]) => void) => {
        const db = this.GetDatabase();

        const albums: MusicAlbum[] = [];

        db.all(getAllMusicAlbums, (err: any, rows: MusicAlbumQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                albums.push({
                    musicAlbumId: row.MusicAlbumId,
                    title: row.Title,
                    artist: row.Artist,
                    coverImageUrl: row.CoverImageUrl,
                    thoughts: row.Thoughts,
                    isTopTen: convertToBoolean(row.IsTopTen),
                    showOnNowPage: convertToBoolean(row.ShowOnNowPage),
                    genres: [],
                    formats: [],
                    tracks: [],
                });
            });

            return callback(null, albums);
        });
    };

    static readonly GetMusicAlbumsOnNowPage = (callback: (error: string | null, albums: MusicAlbum[]) => void) => {
        const db = this.GetDatabase();

        const albums: MusicAlbum[] = [];

        db.all(getMusicAlbumsOnNowPage, (err: any, rows: MusicAlbumQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                albums.push({
                    musicAlbumId: row.MusicAlbumId,
                    title: row.Title,
                    artist: row.Artist,
                    coverImageUrl: row.CoverImageUrl,
                    thoughts: row.Thoughts,
                    isTopTen: convertToBoolean(row.IsTopTen),
                    showOnNowPage: convertToBoolean(row.ShowOnNowPage),
                    genres: [],
                    formats: [],
                    tracks: [],
                });
            });

            return callback(null, albums);
        });
    };

    static readonly GetMusicAlbumById = (id: number, callback: (error: string | null, album: MusicAlbum | null) => void) => {
        const db = this.GetDatabase();

        db.get(getMusicAlbumById, [id], (err: any, row: MusicAlbumQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                musicAlbumId: row.MusicAlbumId,
                title: row.Title,
                artist: row.Artist,
                coverImageUrl: row.CoverImageUrl,
                thoughts: row.Thoughts,
                isTopTen: convertToBoolean(row.IsTopTen),
                showOnNowPage: convertToBoolean(row.ShowOnNowPage),
                genres: [],
                formats: [],
                tracks: [],
            });
        });
    };

    static readonly AddMusicAlbumGenreLinks = (genres: { musicAlbumId: number, genreId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];

            db.run(insertMusicAlbumGenreLink, [genre.musicAlbumId, genre.genreId], function (err) {
                if (err) throw err;
            });
        }
    };

    static readonly AddMusicFormatLinks = (formats: { musicAlbumId: number, formatId: number }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < formats.length; i++) {
            const format = formats[i];

            db.run(insertMusicAlbumFormatLink, [format.musicAlbumId, format.formatId], function (err) {
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

    static readonly AddMusicAlbum = (album: MusicAlbum, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(
            insertMusicAlbum,
            [
                album.title,
                album.artist,
                album.thoughts,
                album.coverImageUrl,
                album.isTopTen,
                album.showOnNowPage,
            ],
            (err) => {
                db.close();

                if (err) {
                    return callback(cleanSqliteError(err));
                }

                this.GetLastInsertedId((error, albumId) => {
                    if (error || !albumId) {
                        return callback(error ?? 'Error retrieving last ID');
                    }

                    const genres = album.genres.map((g) => ({ musicAlbumId: albumId, genreId: g.musicGenreId }));
                    const formats = album.formats.map((f) => ({ musicAlbumId: albumId, formatId: f.musicFormatId }));

                    this.AddMusicAlbumGenreLinks(genres);
                    this.AddMusicFormatLinks(formats);
                });

                return callback(null);
            }
        );
    };

    static readonly UpdateMusicAlbum = (album: MusicAlbum, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(
            updateMusicAlbum,
            [
                album.title,
                album.artist,
                album.thoughts,
                album.coverImageUrl,
                album.isTopTen,
                album.showOnNowPage,
                album.musicAlbumId,
            ],
            (err) => {
                if (err) {
                    db.close();
                    return callback(cleanSqliteError(err));
                }

                db.serialize(() => {
                    db
                        .run(clearMusicAlbumGenreLinks, [album.musicAlbumId])
                        .run(clearMusicAlbumFormatLinks, [album.musicAlbumId], (error) => {
                            db.close();

                            if (error) {
                                return callback(cleanSqliteError(error));
                            }

                            const genres = album.genres.map((g) => ({ musicAlbumId: album.musicAlbumId, genreId: g.musicGenreId }));
                            const formats = album.formats.map((f) => ({ musicAlbumId: album.musicAlbumId, formatId: f.musicFormatId }));

                            this.AddMusicAlbumGenreLinks(genres);
                            this.AddMusicFormatLinks(formats);
                        });
                }
                );

                return callback(null);
            });
    };

    static readonly DeleteMusicAlbum = (albumId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.serialize(() => {
            db
                .run(clearMusicAlbumGenreLinks, [albumId])
                .run(clearMusicAlbumFormatLinks, [albumId])
                .run(clearTracksFromAlbum, [albumId])
                .run(deleteMusicAlbum, [albumId], (err) => {
                    db.close();

                    if (err) {
                        return callback(cleanSqliteError(err));
                    }

                    return callback(null);
                });
        });
    };

    static readonly AddTracksToAlbum = (albumId: number, tracks: { trackNumber: number; title: string }[]) => {
        const db = this.GetDatabase();

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];

            db.run(insertAlbumTrack, [albumId, track.trackNumber, track.title], function (err) {
                if (err) throw err;
            });
        }
    }

    static readonly UpdateAlbumTracks = (albumId: number, tracks: { trackNumber: number; title: string }[], callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(clearTracksFromAlbum, [albumId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            this.AddTracksToAlbum(albumId, tracks);

            return callback(null);
        });
    };

    static readonly GetAllMusicGenres = (callback: (error: string | null, genres: MusicGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: MusicGenre[] = [];

        db.all(getAllMusicGenres, (err: any, rows: MusicGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    musicGenreId: row.MusicGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    albumCount: row.MusicAlbumCount,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetMusicGenreById = (id: number, callback: (error: string | null, genre: MusicGenre | null) => void) => {
        const db = this.GetDatabase();

        db.get(getMusicGenreById, [id], (err, row: MusicGenreQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                musicGenreId: row.MusicGenreId,
                name: row.Name,
                colorCode: row.ColorCode,
                albumCount: row.MusicAlbumCount,
            });
        });
    };

    static readonly AddMusicGenre = (genre: MusicGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertMusicGenre, [genre.name, genre.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateMusicGenre = (genre: MusicGenre, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateMusicGenre, [
            genre.name,
            genre.colorCode,
            genre.musicGenreId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteMusicGenre = (genreId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteMusicGenre, [genreId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly GetAllTracks = (callback: (error: string | null, tracks: AlbumTrack[]) => void) => {
        const db = this.GetDatabase();

        const tracks: AlbumTrack[] = [];

        db.all(getAllTracks, (err: any, rows: AlbumTrackQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                tracks.push({
                    musicAlbumTrackId: row.MusicAlbumTrackId,
                    musicAlbumId: row.MusicAlbumId,
                    trackNumber: row.TrackNumber,
                    title: row.Title,
                });
            });

            return callback(null, tracks);
        });
    };

    static readonly GetTracksForAlbum = (albumId: number, callback: (error: string | null, tracks: AlbumTrack[]) => void) => {
        const db = this.GetDatabase();

        const tracks: AlbumTrack[] = [];

        db.all(getTracksForAlbum, [albumId], (err: any, rows: AlbumTrackQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                tracks.push({
                    musicAlbumTrackId: row.MusicAlbumTrackId,
                    musicAlbumId: row.MusicAlbumId,
                    trackNumber: row.TrackNumber,
                    title: row.Title,
                });
            });

            return callback(null, tracks);
        });
    };

    static readonly GetAllAlbumGenreLinks = (callback: (error: string | null, genreLinks: MusicGenreLink[]) => void) => {
        const db = this.GetDatabase();

        const genreLinks: MusicGenreLink[] = [];

        db.all(getAllMusicGenreLinks, (err: any, rows: MusicGenreLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genreLinks.push({
                    musicAlbumId: row.MusicAlbumId,
                    genreId: row.MusicGenreId,
                    genreName: row.MusicGenreName,
                    genreColorCode: row.MusicGenreColor,
                });
            });

            return callback(null, genreLinks);
        });
    };

    static readonly GetAllAlbumFormatLinks = (callback: (error: string | null, formatLinks: MusicFormatLink[]) => void) => {
        const db = this.GetDatabase();

        const formatLinks: MusicFormatLink[] = [];

        db.all(getAllMusicFormatLinks, (err: any, rows: MusicFormatLinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                formatLinks.push({
                    musicAlbumId: row.MusicAlbumId,
                    formatId: row.MusicFormatId,
                    formatName: row.MusicFormatName,
                    formatColorCode: row.MusicFormatColor,
                });
            });

            return callback(null, formatLinks);
        });
    };

    static readonly GetGenresForAlbum = (albumId: number, callback: (error: string | null, genres: MusicGenre[]) => void) => {
        const db = this.GetDatabase();

        const genres: MusicGenre[] = [];

        db.all(getGenresForMusicAlbum, [albumId], (err: any, rows: MusicGenreQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                genres.push({
                    musicGenreId: row.MusicGenreId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                });
            });

            return callback(null, genres);
        });
    };

    static readonly GetFormatsForAlbum = (albumId: number, callback: (error: string | null, systems: MusicFormat[]) => void) => {
        const db = this.GetDatabase();

        const formats: MusicFormat[] = [];

        db.all(getFormatsForMusicAlbum, [albumId], (err: any, rows: MusicFormatQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                formats.push({
                    musicFormatId: row.MusicFormatId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                });
            });

            return callback(null, formats);
        });
    };
}

export default MusicRepository;
