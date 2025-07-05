import { db } from '@lib/db';

import {
	VideoServiceQueryReturn,
	VideoGenreQueryReturn,
	VideoGenre,
	VideoService
} from '@models/system';

import {
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
} from '@queries/system';


class SystemRepository {
	static async GetAllVideoGenres(): Promise<[error: string | null, genres: VideoGenre[]]> {
		const [error, data] = await db.Query<VideoGenreQueryReturn>(getAllVideoGenres);

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

	static async GetVideoGenreById(id: number): Promise<[error: string | null, genre: VideoGenre | null]> {
		const [error, data] = await db.QuerySingle<VideoGenreQueryReturn>(getVideoGenreById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			videoGenreId: data.VideoGenreId,
			name: data.Name,
			colorCode: data.ColorCode,
			movieCount: data.MovieCount,
		}];
	}

	static async AddVideoGenre(genre: VideoGenre): Promise<string | null> {
		return await db.Execute(insertVideoGenre, [genre.name, genre.colorCode]);
	}

	static async UpdateVideoGenre(genre: VideoGenre): Promise<string | null> {
		return await db.Execute(updateVideoGenre, [
			genre.name,
			genre.colorCode,
			genre.videoGenreId,
		]);
	}

	static async DeleteVideoGenre(videoGenreId: number): Promise<string | null> {
		return await db.Execute(deleteVideoGenre, [videoGenreId]);
	}

	static async GetAllVideoServices(): Promise<[error: string | null, services: VideoService[]]> {
		const [error, data] = await db.Query<VideoServiceQueryReturn>(getAllVideoServices);

		if (error) {
			return [error, []];
		}

		const services: VideoService[] = [];

		data.forEach((row) => {
			services.push({
				videoServiceId: row.VideoServiceId,
				name: row.Name,
				colorCode: row.ColorCode,
				tvShowCount: row.TvShowCount,
				movieCount: row.MovieCount,
			});
		});

		return [null, services];
	}

	static async GetVideoServiceById(id: number): Promise<[error: string | null, genre: VideoService | null]> {
		const [error, data] = await db.QuerySingle<VideoServiceQueryReturn>(getVideoServiceById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			videoServiceId: data.VideoServiceId,
			name: data.Name,
			colorCode: data.ColorCode,
			tvShowCount: data.TvShowCount,
			movieCount: data.MovieCount,
		}];
	}

	static async AddVideoService(service: VideoService): Promise<string | null> {
		return await db.Execute(insertVideoService, [service.name, service.colorCode]);
	}

	static async UpdateVideoService(service: VideoService): Promise<string | null> {
		return await db.Execute(updateVideoService, [
			service.name,
			service.colorCode,
			service.videoServiceId,
		]);
	}

	static async DeleteVideoService(videoServiceId: number): Promise<string | null> {
		return await db.Execute(deleteVideoService, [videoServiceId]);
	}
}

export { SystemRepository };
