import express from 'express';

const router = express.Router();

import MusicRepository from './lib/MusicRepository';
import { MusicAlbum, AlbumTrack, MusicGenre } from '../models/music';

router.get('/genre', (_, res) => {
    MusicRepository.GetAllMusicGenres((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MusicRepository.GetMusicGenreById(id, (error, genre) => {
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
    const { musicGenreId, name, colorCode } = req.body;

    const genre: MusicGenre = {
        musicGenreId: parseInt(musicGenreId),
        name,
        colorCode,
    };

    MusicRepository.AddMusicGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.put('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const { name, colorCode } = req.body;

    const genre: MusicGenre = {
        musicGenreId: id,
        name,
        colorCode,
    };

    MusicRepository.UpdateMusicGenre(genre, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/genre/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MusicRepository.DeleteMusicGenre(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

router.put('/tracks/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const {
        tracks,
    } = req.body;

    const albumTracks: AlbumTrack[] = tracks
        .map((t: { trackNumber: number, title: string }) => ({
            musicAlbumTrackId: 0,
            musicAlbumId: id,
            trackNumber: t.trackNumber,
            title: t.title,
        }));

    MusicRepository.UpdateAlbumTracks(id, albumTracks, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        console.log('all good');

        res.send();
    });
});

router.get('/', (_, res) => {
    MusicRepository.GetAllAlbumGenreLinks((genreLinkError, genreLinks) => {
        if (genreLinkError) {
            return res.status(400).json({ error: genreLinkError });
        }

        MusicRepository.GetAllAlbumFormatLinks((formatLinkError, formatLinks) => {
            if (formatLinkError) {
                return res.status(400).json({ error: formatLinkError });
            }

            MusicRepository.GetAllTracks((trackError, tracks) => {
                if (trackError) {
                    return res.status(400).json({ error: trackError })
                }

                MusicRepository.GetAllMusicAlbums((error, data) => {
                    if (error) {
                        return res.status(400).json({ error });
                    }

                    const albums: MusicAlbum[] = [];

                    data.forEach((album) => {
                        album.genres = genreLinks
                            .filter((g) => g.musicAlbumId == album.musicAlbumId)
                            .map((g) => ({ musicGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode }));

                        album.formats = formatLinks
                            .filter((f) => f.musicAlbumId == album.musicAlbumId)
                            .map((f) => ({ musicFormatId: f.formatId, name: f.formatName, colorCode: f.formatColorCode }));

                        album.tracks = tracks
                            .filter((t) => t.musicAlbumId === album.musicAlbumId)
                            .sort((a, b) => a.trackNumber - b.trackNumber);

                        albums.push(album);
                    });

                    res.json(albums);
                });
            });
        });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MusicRepository.GetGenresForAlbum(id, (genreError, genres) => {
        if (genreError) {
            return res.status(400).json({ error: genreError });
        }

        MusicRepository.GetFormatsForAlbum(id, (formatError, formats) => {
            if (formatError) {
                return res.status(400).json({ error: formatError });
            }

            MusicRepository.GetTracksForAlbum(id, (trackError, tracks) => {
                if (trackError) {
                    return res.status(400).json({ error: trackError });
                }

                MusicRepository.GetMusicAlbumById(id, (error, data) => {
                    if (error) {
                        return res.status(400).json({ error });
                    }

                    if (!data) {
                        res.status(404).json({ error: 'Album not found' });
                    } else {
                        res.json({
                            ...data,
                            genres,
                            formats,
                            tracks,
                        });
                    }
                });
            });
        });
    });
});

router.post('/', (req, res) => {
    const {
        title,
        artist,
        thoughts,
        coverImageUrl,
        isTopTen,
        showOnNowPage,
        genres,
        formats,
    } = req.body;

    const album: MusicAlbum = {
        musicAlbumId: 0,
        title,
        artist,
        thoughts: thoughts ?? '',
        coverImageUrl: coverImageUrl ?? '',
        isTopTen: isTopTen ?? false,
        showOnNowPage: showOnNowPage ?? false,
        genres: genres.map((g: number) => ({ musicGenreId: g, name: '', colorCode: '' })),
        formats: formats.map((f: number) => ({ musicFormatId: f, name: '', colorCode: '' })),
        tracks: [],
    };

    MusicRepository.AddMusicAlbum(album, (error) => {
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
        artist,
        thoughts,
        coverImageUrl,
        isTopTen,
        showOnNowPage,
        genres,
        formats,
    } = req.body;

    const album: MusicAlbum = {
        musicAlbumId: id,
        title,
        artist,
        thoughts: thoughts ?? '',
        coverImageUrl: coverImageUrl ?? '',
        isTopTen: isTopTen ?? false,
        showOnNowPage: showOnNowPage ?? false,
        genres: genres.map((g: number) => ({ musicGenreId: g, name: '', colorCode: '' })),
        formats: formats.map((f: number) => ({ musicFormatId: f, name: '', colorCode: '' })),
        tracks: [],
    };

    MusicRepository.UpdateMusicAlbum(album, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    MusicRepository.DeleteMusicAlbum(id, (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.send();
    });

    res.send();
});

export default router;