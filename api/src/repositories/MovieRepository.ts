import { db } from '@lib/db';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import convertDateToJsonDate from '@lib/convertDateToJsonDate';

import {
	Movie,
	MovieGenreLink,
	MovieServiceLink,
	MovieQueryReturn,
	MovieGenreLinkQueryReturn,
	MovieServiceLinkQueryReturn,
} from '@models/movie';
import {
	VideoService,
	VideoGenre,
	VideoGenreQueryReturn,
	VideoServiceQueryReturn,
} from '@models/system';

import {
	getAllMovies,
	getGenresForMovie,
	getAllMovieGenreLinks,
	getAllMovieServiceLinks,
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
} from '@queries/movie';

dayjs.extend(isSameOrAfter);

class MovieRepository {
	static async GetGenresForMovie(movieId: number): Promise<[error: string | null, genres: VideoGenre[]]> {
		const [error, data] = await db.Query<VideoGenreQueryReturn>(getGenresForMovie, [movieId]);

		if (error) {
			return [error, []];
		}

		const genres: VideoGenre[] = [];

		data.forEach((row) => {
			genres.push({
				videoGenreId: row.VideoGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
				movieCount: row.MovieCount,
			});
		});

		return [null, genres];
	}

	static async GetServicesForMovie(movieId: number): Promise<[error: string | null, genres: VideoService[]]> {
		const [error, data] = await db.Query<VideoServiceQueryReturn>(getServicesForMovie, [movieId]);

		if (error) {
			return [error, []];
		}

		const services: VideoService[] = [];

		data.forEach((row) => {
			services.push({
				videoServiceId: row.VideoServiceId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});

		return [null, services];
	}

	static async GetAllMovieGenreLinks(): Promise<[error: string | null, genreLinks: MovieGenreLink[]]> {
		const [error, data] = await db.Query<MovieGenreLinkQueryReturn>(getAllMovieGenreLinks);

		if (error) {
			return [error, []];
		}

		const genreLinks: MovieGenreLink[] = [];

		data.forEach((row) => {
			genreLinks.push({
				movieId: row.MovieId,
				genreId: row.VideoGenreId,
				genreName: row.VideoGenreName,
				genreColorCode: row.VideoGenreColor,
			});
		});

		return [null, genreLinks];
	}

	static async GetAllMovieServiceLinks(): Promise<[error: string | null, genreLinks: MovieServiceLink[]]> {
		const [error, data] = await db.Query<MovieServiceLinkQueryReturn>(getAllMovieServiceLinks);

		if (error) {
			return [error, []];
		}

		const serviceLinks: MovieServiceLink[] = [];

		data.forEach((row) => {
			serviceLinks.push({
				movieId: row.MovieId,
				serviceId: row.VideoServiceId,
				serviceName: row.VideoServiceName,
				serviceColorCode: row.VideoServiceColor,
			});
		});

		return [null, serviceLinks];
	}

	static async GetAllMovies(): Promise<[error: string | null, movies: Movie[]]> {
		const [
			[error, data],
			[genreLinksError, genreLinks],
			[serviceLinksError, serviceLinks],
		] = await Promise.all([
			db.Query<MovieQueryReturn>(getAllMovies),
			this.GetAllMovieGenreLinks(),
			this.GetAllMovieServiceLinks(),
		]);

		if (error || genreLinksError || serviceLinksError) {
			return [error ?? genreLinksError ?? serviceLinksError, []];
		}

		const movies: Movie[] = [];

		data.forEach((row) => {
			movies.push({
				movieId: row.MovieId,
				statusId: row.MovieStatusId,
				title: row.Title,
				imdbLink: row.ImdbLink,
				posterImageUrl: row.PosterImageUrl,
				dateWatched: convertDateToJsonDate(row.DateWatched),
				rating: row.Rating,
				thoughts: row.Thoughts,
				sortOrder: row.SortOrder,
				status: {
					movieStatusId: row.MovieStatusId,
					name: row.MovieStatusName,
					colorCode: row.MovieStatusColor,
				},
				genres: genreLinks
					.filter((g) => g.movieId == row.MovieId)
					.map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				services: serviceLinks
					.filter((s) => s.movieId == row.MovieId)
					.map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode })),
			});
		});

		return [null, movies];
	}

	static async GetMovieById(id: number): Promise<[error: string | null, movie: Movie | null]> {
		const [
			[error, data],
			[genreError, genres],
			[serviceError, services],
		] = await Promise.all([
			db.QuerySingle<MovieQueryReturn>(getMovieById, [id]),
			this.GetGenresForMovie(id),
			this.GetServicesForMovie(id),
		]);

		if (error || genreError || serviceError) {
			return [error ?? genreError ?? serviceError, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			movieId: data.MovieId,
			statusId: data.MovieStatusId,
			title: data.Title,
			imdbLink: data.ImdbLink,
			posterImageUrl: data.PosterImageUrl,
			dateWatched: convertDateToJsonDate(data.DateWatched),
			rating: data.Rating,
			thoughts: data.Thoughts,
			sortOrder: data.SortOrder,
			status: {
				movieStatusId: data.MovieStatusId,
				name: data.MovieStatusName,
				colorCode: data.MovieStatusColor,
			},
			genres,
			services,
		}]
	}

	static async AddMovieGenreLinks(genres: { movieId: number, genreId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < genres.length; i++) {
			const genre = genres[i];

			const err = await db.Execute(insertMovieGenreLink, [genre.movieId, genre.genreId]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async AddMovieServiceLinks(services: { movieId: number, serviceId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < services.length; i++) {
			const service = services[i];

			const err = await db.Execute(insertMovieServiceLink, [service.movieId, service.serviceId]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async GetLastInsertedRowId(): Promise<[error: string | null, id: number | null]> {
		const [error, data] = await db.QuerySingle<number>(getLastInsertedId);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, data];
	}

	static async AddMovie(movie: Movie): Promise<string | null> {
		const error = await db.Execute(insertMovie, [
			movie.statusId,
			movie.title,
			movie.imdbLink,
			movie.posterImageUrl,
			movie.dateWatched,
			movie.rating,
			movie.thoughts,
			movie.sortOrder
		]);

		if (error) {
			return error;
		}

		const [idError, movieId] = await this.GetLastInsertedRowId();

		if (idError || !movieId) {
			return idError ?? 'Unable to get movie ID';
		}

		const genres = movie.genres.map((g) => ({ movieId, genreId: g.videoGenreId }));
		const services = movie.services.map((g) => ({ movieId, serviceId: g.videoServiceId }));

		const [genreError, serviceError] = await Promise.all([
			this.AddMovieGenreLinks(genres),
			this.AddMovieServiceLinks(services),
		]);

		if (genreError || serviceError) {
			return genreError ?? serviceError;
		}

		return null;
	}

	static async ClearMovieGenres(movieId: number): Promise<string | null> {
		return await db.Execute(clearMovieGenreLinks, [movieId]);
	}

	static async ClearMovieServices(movieId: number): Promise<string | null> {
		return await db.Execute(clearMovieServiceLinks, [movieId]);
	}

	static async UpdateMovie(movie: Movie): Promise<string | null> {
		const [updateError, clearGenresError, clearServicesError] = await Promise.all([
			db.Execute(updateMovie, [
				movie.statusId,
				movie.title,
				movie.imdbLink,
				movie.posterImageUrl,
				movie.dateWatched,
				movie.rating,
				movie.thoughts,
				movie.sortOrder,
				movie.movieId,
			]),
			this.ClearMovieGenres(movie.movieId),
			this.ClearMovieServices(movie.movieId),
		]);

		if (updateError || clearGenresError || clearServicesError) {
			return updateError ?? clearGenresError ?? clearServicesError;
		}

		const genres = movie.genres.map((g) => ({ movieId: movie.movieId, genreId: g.videoGenreId }));
		const services = movie.services.map((g) => ({ movieId: movie.movieId, serviceId: g.videoServiceId }));

		const [genreError, serviceError] = await Promise.all([
			this.AddMovieGenreLinks(genres),
			this.AddMovieServiceLinks(services),
		]);

		if (genreError || serviceError) {
			return genreError ?? serviceError;
		}

		return null;
	}

	static async DeleteMovie(id: number): Promise<string | null> {
		const [
			clearGenresError,
			clearServicesError,
		] = await Promise.all([
			this.ClearMovieGenres(id),
			this.ClearMovieServices(id),
		]);

		if (clearGenresError || clearServicesError) {
			return clearGenresError ?? clearServicesError;
		}

		return await db.Execute(deleteMovie, [id]);
	}

	static async GetRecentMovies(days: number): Promise<[error: string | null, movies: Movie[]]> {
		const [
			[error, data],
			[genreLinksError, genreLinks],
			[serviceLinksError, serviceLinks],
		] = await Promise.all([
			db.Query<MovieQueryReturn>(getAllMovies),
			this.GetAllMovieGenreLinks(),
			this.GetAllMovieServiceLinks(),
		]);

		if (error || genreLinksError || serviceLinksError) {
			return [error ?? genreLinksError ?? serviceLinksError, []];
		}

		const movies: Movie[] = [];

		data.forEach((row) => {
			const limit = dayjs().subtract(days, 'day');

			if (row.DateWatched && dayjs(row.DateWatched).isSameOrAfter(limit)) {
				movies.push({
					movieId: row.MovieId,
					statusId: row.MovieStatusId,
					title: row.Title,
					imdbLink: row.ImdbLink,
					posterImageUrl: row.PosterImageUrl,
					dateWatched: convertDateToJsonDate(row.DateWatched),
					rating: row.Rating,
					thoughts: row.Thoughts,
					sortOrder: row.SortOrder,
					status: {
						movieStatusId: row.MovieStatusId,
						name: row.MovieStatusName,
						colorCode: row.MovieStatusColor,
					},
					genres: genreLinks
						.filter((g) => g.movieId == row.MovieId)
						.map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
					services: serviceLinks
						.filter((s) => s.movieId == row.MovieId)
						.map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode })),
				});
			}
		});

		return [null, movies];
	}
}

export default MovieRepository;
