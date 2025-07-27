import { db } from '@lib/db';
import calculateProgress from '@lib/calculateProgress';

import {
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
} from '@queries/tv';

import { VideoService, VideoGenre } from '@models/system';
import { VideoGenreQueryReturn, VideoServiceQueryReturn } from '@models/system';
import {
	TelevisionShowServiceLink,
	TelevisionShow,
	TelevisionShowGenreLink,
	TvQueryReturn,
	TvGenreLinkQueryReturn,
	TvServiceLinkQueryReturn,
} from '@models/tv';

class TvRepository {
	static async GetAllTelevisionShows(): Promise<[error: string | null, televisionShows: TelevisionShow[]]> {
		const [
			[tvError, tv],
			[genreError, genres],
			[serviceError, services],
		] = await Promise.all([
			db.Query<TvQueryReturn>(getAllTelevisionShows),
			this.GetAllTelevisionGenreLinks(),
			this.GetAllTelevisionServiceLinks(),
		]);

		if (tvError || genreError || serviceError) {
			return [tvError ?? genreError ?? serviceError, []];
		}

		const tvShows: TelevisionShow[] = [];

		tv.forEach((row) => {
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
				genres: genres
					.filter((g) => g.televisionShowId === row.TelevisionShowId)
					.map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				services: services
					.filter((s) => s.televisionShowId === row.TelevisionShowId)
					.map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode })),
			});
		});

		return [null, tvShows];
	}

	static async GetTelevisionShowById(id: number): Promise<[error: string | null, televisionShow: TelevisionShow | null]> {
		const [
			[tvError, tvShow],
			[genreError, genres],
			[serviceError, services],
		] = await Promise.all([
			db.QuerySingle<TvQueryReturn>(getTelevisionShowById, [id]),
			this.GetGenresForTelevisionShow(id),
			this.GetServicesForTelevisionShow(id),
		]);

		if (tvError || genreError || serviceError) {
			return [tvError ?? genreError ?? serviceError, null];
		}

		if (!tvShow) {
			return [null, null];
		}

		return [null, {
			televisionShowId: tvShow.TelevisionShowId,
			statusId: tvShow.TelevisionStatusId,
			title: tvShow.Title,
			imdbLink: tvShow.ImdbLink,
			coverImageUrl: tvShow.CoverImageUrl,
			sortOrder: tvShow.SortOrder,
			seasonEpisodeCount: tvShow.SeasonEpisodeCount,
			currentSeasonEpisode: tvShow.CurrentSeasonEpisode,
			progress: calculateProgress(tvShow.CurrentSeasonEpisode, tvShow.SeasonEpisodeCount),
			rating: tvShow.Rating,
			thoughts: tvShow.Thoughts,
			status: {
				televisionStatusId: tvShow.TelevisionStatusId,
				name: tvShow.TelevsionShowStatusName,
				colorCode: tvShow.TelevsionShowStatusColor,
			},
			genres,
			services,
		}];
	}

	static async GetCurrentTelevisionShows(): Promise<[error: string | null, televisionShows: TelevisionShow[]]> {
		const [
			[tvError, tv],
			[genreError, genres],
			[serviceError, services],
		] = await Promise.all([
			db.Query<TvQueryReturn>(getCurrentTelevisionShows),
			this.GetAllTelevisionGenreLinks(),
			this.GetAllTelevisionServiceLinks(),
		]);

		if (tvError || genreError || serviceError) {
			return [tvError ?? genreError ?? serviceError, []];
		}

		const tvShows: TelevisionShow[] = [];

		tv.forEach((row) => {
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
				genres: genres
					.filter((g) => g.televisionShowId === row.TelevisionShowId)
					.map((g) => ({ videoGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				services: services
					.filter((s) => s.televisionShowId === row.TelevisionShowId)
					.map((s) => ({ videoServiceId: s.serviceId, name: s.serviceName, colorCode: s.serviceColorCode })),
			});
		});

		return [null, tvShows];
	}

	static async AddTelevisionShowGenreLinks(genres: { televisionShowId: number, genreId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < genres.length; i++) {
			const genre = genres[i];

			const err = await db.Execute(insertTvGenreLink, [genre.televisionShowId, genre.genreId]);

			if (err) {
				error = err;
			}
		}

		return error;
	};

	static async AddTelevisionShowServiceLinks(services: { televisionShowId: number, serviceId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < services.length; i++) {
			const service = services[i];

			const err = await db.Execute(insertTvServiceLink, [service.televisionShowId, service.serviceId]);

			if (err) {
				error = err;
			}
		}

		return error;
	};

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

	static async AddTelevisionShow(televsionShow: TelevisionShow): Promise<string | null> {
		const error = await db.Execute(insertTelevsionShow, [
			televsionShow.imdbLink,
			televsionShow.statusId,
			televsionShow.coverImageUrl,
			televsionShow.rating,
			televsionShow.thoughts,
			televsionShow.title,
			televsionShow.sortOrder,
			televsionShow.seasonEpisodeCount,
			televsionShow.currentSeasonEpisode,
		])

		if (error) {
			return error;
		}

		const [idError, televisionShowId] = await this.GetLastInsertedRowId();

		if (idError || !televisionShowId) {
			return idError ?? 'Unable to retrieve TV ID';
		}

		const genres = televsionShow.genres.map((g) => ({ televisionShowId, genreId: g.videoGenreId }));
		const services = televsionShow.services.map((g) => ({ televisionShowId, serviceId: g.videoServiceId }));

		const [genresError, servicesError] = await Promise.all([
			this.AddTelevisionShowGenreLinks(genres),
			this.AddTelevisionShowServiceLinks(services),
		]);

		return genresError ?? servicesError ?? null;
	};

	static async DeleteTelevisionShowGenreLinks(televisionShowId: number): Promise<string | null> {
		return await db.Execute(clearTvGenreLinks, [televisionShowId]);
	}

	static async DeleteTelevisionShowServiceLinks(televisionShowId: number): Promise<string | null> {
		return await db.Execute(clearTvServiceLinks, [televisionShowId]);
	}

	static async UpdateTelevisionShow(televisionShow: TelevisionShow): Promise<string | null> {
		const [updateError, clearGenresError, clearServicesError] = await Promise.all([
			db.Execute(updateTelevisionShow, [
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
			]),
			this.DeleteTelevisionShowGenreLinks(televisionShow.televisionShowId),
			this.DeleteTelevisionShowServiceLinks(televisionShow.televisionShowId),
		]);

		if (updateError || clearGenresError || clearServicesError) {
			return updateError ?? clearGenresError ?? clearServicesError;
		}

		const genres = televisionShow.genres.map((g) => ({ televisionShowId: televisionShow.televisionShowId, genreId: g.videoGenreId }));
		const services = televisionShow.services.map((g) => ({ televisionShowId: televisionShow.televisionShowId, serviceId: g.videoServiceId }));

		const [genresError, servicesError] = await Promise.all([
			this.AddTelevisionShowGenreLinks(genres),
			this.AddTelevisionShowServiceLinks(services),
		]);

		return genresError ?? servicesError ?? null;
	};

	static async DeleteTelevisionShow(televisionShowId: number): Promise<string | null> {
		const [
			deleteGenresError,
			deleteServicesError,
		] = await Promise.all([
			this.DeleteTelevisionShowGenreLinks(televisionShowId),
			this.DeleteTelevisionShowServiceLinks(televisionShowId),
		]);

		if (deleteGenresError || deleteServicesError) {
			return deleteGenresError ?? deleteServicesError;
		}

		return await db.Execute(deleteTelevisionShow, [televisionShowId]);
	};

	static async GetAllTelevisionGenreLinks(): Promise<[error: string | null, genreLinks: TelevisionShowGenreLink[]]> {
		const [error, data] = await db.Query<TvGenreLinkQueryReturn>(getAllTvGenreLinks);

		if (error) {
			return [error, []];
		}

		const genreLinks: TelevisionShowGenreLink[] = [];

		data.forEach((row) => {
			genreLinks.push({
				televisionShowId: row.TelevisionShowId,
				genreId: row.VideoGenreId,
				genreName: row.VideoGenreName,
				genreColorCode: row.VideoGenreColor,
			});
		});

		return [null, genreLinks];
	}

	static async GetAllTelevisionServiceLinks(): Promise<[error: string | null, serviceLinks: TelevisionShowServiceLink[]]> {
		const [error, data] = await db.Query<TvServiceLinkQueryReturn>(getAllTvServiceLinks);

		if (error) {
			return [error, []];
		}

		const serviceLinks: TelevisionShowServiceLink[] = [];

		data.forEach((row) => {
			serviceLinks.push({
				televisionShowId: row.TelevisionShowId,
				serviceId: row.VideoServiceId,
				serviceName: row.VideoServiceName,
				serviceColorCode: row.VideoServiceColor,
			});
		});

		return [null, serviceLinks];
	}

	static async GetGenresForTelevisionShow(televisionShowId: number): Promise<[error: string | null, genres: VideoGenre[]]> {
		const [error, data] = await db.Query<VideoGenreQueryReturn>(getGenresForTelevisionShow, [televisionShowId]);

		if (error) {
			return [error, []];
		}

		const genres: VideoGenre[] = [];

		data.forEach((row) => {
			genres.push({
				videoGenreId: row.VideoGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});

		return [null, genres];
	}

	static async GetServicesForTelevisionShow(televisionShowId: number): Promise<[error: string | null, genres: VideoService[]]> {
		const [error, data] = await db.Query<VideoServiceQueryReturn>(getServicesForTelevisionShow, [televisionShowId]);

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

	static async UpdateTelevisionShowProgress(televisionShowId: number, currentSeasonEpisode: number): Promise<string | null> {
		return await db.Execute(updateTelevisionShowProgress, [currentSeasonEpisode, televisionShowId]);
	}
}

export { TvRepository };
