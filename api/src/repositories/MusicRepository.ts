import { db } from '@lib/db';

import convertToBoolean from '@lib/convertToBoolean';

import {
	MusicAlbum,
	MusicFormat,
	AlbumTrack,
	MusicFormatLink,
	MusicGenre,
	MusicGenreLink,
	AlbumTrackQueryReturn,
	MusicAlbumQueryReturn,
	MusicFormatLinkQueryReturn,
	MusicFormatQueryReturn,
	MusicGenreLinkQueryReturn,
	MusicGenreQueryReturn,
} from '@models/music';

import {
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
} from '@queries/music';

class MusicRepository {
	static async GetAllMusicAlbums(): Promise<[error: string | null, albums: MusicAlbum[]]> {
		const [
			[albumsError, albums],
			[genresError, genres],
			[formatsError, formats],
			[tracksError, tracks],
		] = await Promise.all([
			db.Query<MusicAlbumQueryReturn>(getAllMusicAlbums),
			this.GetAllAlbumGenreLinks(),
			this.GetAllAlbumFormatLinks(),
			this.GetAllTracks(),
		]);

		if (albumsError || genresError || formatsError || tracksError) {
			return [albumsError ?? genresError ?? formatsError ?? tracksError, []];
		}

		const musicAlbums: MusicAlbum[] = [];

		albums.forEach((row) => {
			musicAlbums.push({
				musicAlbumId: row.MusicAlbumId,
				title: row.Title,
				artist: row.Artist,
				coverImageUrl: row.CoverImageUrl,
				thoughts: row.Thoughts,
				isTopTen: convertToBoolean(row.IsTopTen),
				showOnNowPage: convertToBoolean(row.ShowOnNowPage),
				genres: genres
					.filter((g) => g.musicAlbumId === row.MusicAlbumId)
					.map((g) => ({ musicGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				formats: formats
					.filter((f) => f.musicAlbumId === row.MusicAlbumId)
					.map((f) => ({ musicFormatId: f.formatId, name: f.formatName, colorCode: f.formatColorCode })),
				tracks: tracks.filter((t) => t.musicAlbumId === row.MusicAlbumId),
			});
		});

		return [null, musicAlbums];
	}

	static async GetMusicAlbumsOnNowPage(): Promise<[error: string | null, albums: MusicAlbum[]]> {
		const [
			[albumsError, albums],
			[genresError, genres],
			[formatsError, formats],
			[tracksError, tracks],
		] = await Promise.all([
			db.Query<MusicAlbumQueryReturn>(getMusicAlbumsOnNowPage),
			this.GetAllAlbumGenreLinks(),
			this.GetAllAlbumFormatLinks(),
			this.GetAllTracks(),
		]);

		if (albumsError || genresError || formatsError || tracksError) {
			return [albumsError ?? genresError ?? formatsError ?? tracksError, []];
		}

		const musicAlbums: MusicAlbum[] = [];

		albums.forEach((row) => {
			musicAlbums.push({
				musicAlbumId: row.MusicAlbumId,
				title: row.Title,
				artist: row.Artist,
				coverImageUrl: row.CoverImageUrl,
				thoughts: row.Thoughts,
				isTopTen: convertToBoolean(row.IsTopTen),
				showOnNowPage: convertToBoolean(row.ShowOnNowPage),
				genres: genres
					.filter((g) => g.musicAlbumId === row.MusicAlbumId)
					.map((g) => ({ musicGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				formats: formats
					.filter((f) => f.musicAlbumId === row.MusicAlbumId)
					.map((f) => ({ musicFormatId: f.formatId, name: f.formatName, colorCode: f.formatColorCode })),
				tracks: tracks.filter((t) => t.musicAlbumId === row.MusicAlbumId),
			});
		});

		return [null, musicAlbums];
	}

	static async GetMusicAlbumById(id: number): Promise<[error: string | null, album: MusicAlbum | null]> {
		const [
			[albumError, album],
			[genresError, genres],
			[formatsError, formats],
			[tracksError, tracks],
		] = await Promise.all([
			db.QuerySingle<MusicAlbumQueryReturn>(getMusicAlbumById, [id]),
			this.GetGenresForAlbum(id),
			this.GetFormatsForAlbum(id),
			this.GetTracksForAlbum(id),
		])

		if (albumError || genresError || formatsError || tracksError) {
			return [albumError ?? genresError ?? formatsError ?? tracksError, null];
		}

		if (!album) {
			return [null, null];
		}

		return [null, {
			musicAlbumId: album.MusicAlbumId,
			title: album.Title,
			artist: album.Artist,
			coverImageUrl: album.CoverImageUrl,
			thoughts: album.Thoughts,
			isTopTen: convertToBoolean(album.IsTopTen),
			showOnNowPage: convertToBoolean(album.ShowOnNowPage),
			genres,
			formats,
			tracks,
		}];
	}

	static async AddMusicAlbumGenreLinks(genres: { musicAlbumId: number, genreId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < genres.length; i++) {
			const genre = genres[i];

			const err = await db.Execute(insertMusicAlbumGenreLink, [genre.musicAlbumId, genre.genreId]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async AddMusicFormatLinks(formats: { musicAlbumId: number, formatId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < formats.length; i++) {
			const format = formats[i];

			const err = await db.Execute(insertMusicAlbumFormatLink, [format.musicAlbumId, format.formatId]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async GetLastInsertedRowId(): Promise<[error: string | null, id: number | null]> {
		const [error, data] = await db.QuerySingle<{ LastInsertedId: number }>(getLastInsertedId);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, data.LastInsertedId];
	}

	static async AddMusicAlbum(album: MusicAlbum): Promise<string | null> {
		const error = await db.Execute(insertMusicAlbum, [
			album.title,
			album.artist,
			album.thoughts,
			album.coverImageUrl,
			album.isTopTen,
			album.showOnNowPage,
		]);

		if (error) {
			return error;
		}

		const [idError, albumId] = await this.GetLastInsertedRowId();

		if (idError || !albumId) {
			return idError ?? 'Unable to get album ID';
		}

		const genres = album.genres.map((g) => ({ musicAlbumId: albumId, genreId: g.musicGenreId }));
		const formats = album.formats.map((f) => ({ musicAlbumId: albumId, formatId: f.musicFormatId }));

		const [genreError, formatError] = await Promise.all([
			this.AddMusicAlbumGenreLinks(genres),
			this.AddMusicFormatLinks(formats),
		]);

		if (genreError || formatError) {
			return genreError ?? formatError;
		}

		return null;
	}

	static async DeleteMusicAlbumGenreLinks(albumId: number): Promise<string | null> {
		return await db.Execute(clearMusicAlbumGenreLinks, [albumId]);
	}

	static async DeleteMusicAlbumFormatLinks(albumId: number): Promise<string | null> {
		return await db.Execute(clearMusicAlbumFormatLinks, [albumId]);
	}

	static async DeleteMusicAlbumTracks(albumId: number): Promise<string | null> {
		return await db.Execute(clearTracksFromAlbum, [albumId]);
	}

	static async UpdateMusicAlbum(album: MusicAlbum): Promise<string | null> {
		const [updateError, clearGenresError, clearServicesError] = await Promise.all([
			db.Execute(updateMusicAlbum, [
				album.title,
				album.artist,
				album.thoughts,
				album.coverImageUrl,
				album.isTopTen,
				album.showOnNowPage,
				album.musicAlbumId,
			]),
			this.DeleteMusicAlbumGenreLinks(album.musicAlbumId),
			this.DeleteMusicAlbumFormatLinks(album.musicAlbumId),
		]);

		if (updateError || clearGenresError || clearServicesError) {
			return updateError ?? clearGenresError ?? clearServicesError;
		}

		const genres = album.genres.map((g) => ({ musicAlbumId: album.musicAlbumId, genreId: g.musicGenreId }));
		const formats = album.formats.map((f) => ({ musicAlbumId: album.musicAlbumId, formatId: f.musicFormatId }));

		const [genreError, formatError] = await Promise.all([
			this.AddMusicAlbumGenreLinks(genres),
			this.AddMusicFormatLinks(formats),
		]);

		if (genreError || formatError) {
			return genreError ?? formatError;
		}

		return null;
	}

	static async DeleteMusicAlbum(albumId: number): Promise<string | null> {
		const [
			deleteGenresError,
			deleteFormatsError,
			deleteTracksError,
		] = await Promise.all([
			this.DeleteMusicAlbumGenreLinks(albumId),
			this.DeleteMusicAlbumFormatLinks(albumId),
			this.DeleteMusicAlbumTracks(albumId),
		]);

		if (deleteGenresError || deleteFormatsError || deleteTracksError) {
			return deleteGenresError ?? deleteFormatsError ?? deleteTracksError;
		}

		return await db.Execute(deleteMusicAlbum, [albumId]);
	}

	static async AddTracksToAlbum(albumId: number, tracks: { trackNumber: number; title: string }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < tracks.length; i++) {
			const track = tracks[i];

			const err = await db.Execute(insertAlbumTrack, [albumId, track.trackNumber, track.title]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async UpdateAlbumTracks(albumId: number, tracks: { trackNumber: number; title: string }[]): Promise<string | null> {
		const deleteError = await this.DeleteMusicAlbumTracks(albumId);

		if (deleteError) {
			return deleteError;
		}

		return await this.AddTracksToAlbum(albumId, tracks);
	}

	static async GetAllMusicGenres(): Promise<[error: string | null, genres: MusicGenre[]]> {
		const [error, data] = await db.Query<MusicGenreQueryReturn>(getAllMusicGenres);

		if (error) {
			return [error, []];
		}

		const genres: MusicGenre[] = [];

		data.forEach((row) => {
			genres.push({
				musicGenreId: row.MusicGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
				albumCount: row.MusicAlbumCount,
			});
		});

		return [null, genres];
	}

	static async GetMusicGenreById(id: number): Promise<[error: string | null, genre: MusicGenre | null]> {
		const [error, genre] = await db.QuerySingle<MusicGenreQueryReturn>(getMusicGenreById, [id]);

		if (error) {
			return [error, null];
		}

		if (!genre) {
			return [null, null];
		}

		return [null, {
			musicGenreId: genre.MusicGenreId,
			name: genre.Name,
			colorCode: genre.ColorCode,
			albumCount: genre.MusicAlbumCount,
		}];
	}

	static async AddMusicGenre(genre: MusicGenre): Promise<string | null> {
		return await db.Execute(insertMusicGenre, [genre.name, genre.colorCode]);
	}

	static async UpdateMusicGenre(genre: MusicGenre): Promise<string | null> {
		return await db.Execute(updateMusicGenre, [genre.name, genre.colorCode, genre.musicGenreId]);
	}

	static async DeleteMusicGenre(genreId: number): Promise<string | null> {
		return await db.Execute(deleteMusicGenre, [genreId]);
	}

	static async GetAllTracks(): Promise<[error: string | null, tracks: AlbumTrack[]]> {
		const [error, data] = await db.Query<AlbumTrackQueryReturn>(getAllTracks);

		if (error) {
			return [error, []];
		}

		const tracks: AlbumTrack[] = [];

		data.forEach((row) => {
			tracks.push({
				musicAlbumTrackId: row.MusicAlbumTrackId,
				musicAlbumId: row.MusicAlbumId,
				trackNumber: row.TrackNumber,
				title: row.Title,
			});
		});

		return [null, tracks];
	}

	static async GetTracksForAlbum(albumId: number): Promise<[error: string | null, tracks: AlbumTrack[]]> {
		const [error, data] = await db.Query<AlbumTrackQueryReturn>(getTracksForAlbum, [albumId]);

		if (error) {
			return [error, []];
		}

		const tracks: AlbumTrack[] = [];

		data.forEach((row) => {
			tracks.push({
				musicAlbumTrackId: row.MusicAlbumTrackId,
				musicAlbumId: row.MusicAlbumId,
				trackNumber: row.TrackNumber,
				title: row.Title,
			});
		});

		return [null, tracks];
	}

	static async GetAllAlbumGenreLinks(): Promise<[error: string | null, genreLinks: MusicGenreLink[]]> {
		const [error, data] = await db.Query<MusicGenreLinkQueryReturn>(getAllMusicGenreLinks);

		if (error) {
			return [error, []];
		}

		const genreLinks: MusicGenreLink[] = [];

		data.forEach((row) => {
			genreLinks.push({
				musicAlbumId: row.MusicAlbumId,
				genreId: row.MusicGenreId,
				genreName: row.MusicGenreName,
				genreColorCode: row.MusicGenreColor,
			});
		});

		return [null, genreLinks];
	}

	static async GetAllAlbumFormatLinks(): Promise<[error: string | null, genreLinks: MusicFormatLink[]]> {
		const [error, data] = await db.Query<MusicFormatLinkQueryReturn>(getAllMusicFormatLinks);

		if (error) {
			return [error, []];
		}

		const formatLinks: MusicFormatLink[] = [];

		data.forEach((row) => {
			formatLinks.push({
				musicAlbumId: row.MusicAlbumId,
				formatId: row.MusicFormatId,
				formatName: row.MusicFormatName,
				formatColorCode: row.MusicFormatColor,
			});
		});

		return [null, formatLinks];
	}

	static async GetGenresForAlbum(albumId: number): Promise<[error: string | null, genres: MusicGenre[]]> {
		const [error, data] = await db.Query<MusicGenreQueryReturn>(getGenresForMusicAlbum, [albumId]);

		if (error) {
			return [error, []];
		}

		const genres: MusicGenre[] = [];

		data.forEach((row) => {
			genres.push({
				musicGenreId: row.MusicGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});

		return [null, genres]
	}

	static async GetFormatsForAlbum(albumId: number): Promise<[error: string | null, genres: MusicFormat[]]> {
		const [error, data] = await db.Query<MusicFormatQueryReturn>(getFormatsForMusicAlbum, [albumId]);

		if (error) {
			return [error, []];
		}

		const formats: MusicFormat[] = [];

		data.forEach((row) => {
			formats.push({
				musicFormatId: row.MusicFormatId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});

		return [null, formats]
	}
}

export { MusicRepository };
