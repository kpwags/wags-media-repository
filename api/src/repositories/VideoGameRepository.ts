import { db } from '@lib/db';
import convertDateToJsonDate from '@lib/convertDateToJsonDate';

import {
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
} from '@queries/videoGame';

import {
	VideoGame,
	VideoGameGenre,
	VideoGameSystem,
	VideoGameGenreLink,
	VideoGameSystemLink,
	VideoGameQueryReturn,
	VideoGameGenreQueryReturn,
	VideoGameSystemQueryReturn,
	VideoGameGenreLinkQueryReturn,
	VideoGameSystemLinkQueryReturn,
} from '@models/videoGame';

class VideoGameRepository {
	static async GetAllVideoGames(): Promise<[error: string | null, videoGames: VideoGame[]]> {
		const [
			[gamesError, games],
			[genresError, genres],
			[systemsError, systems],
		] = await Promise.all([
			db.Query<VideoGameQueryReturn>(getAllVideoGames),
			this.GetAllVideoGameGenreLinks(),
			this.GetAllVideoGameSystemLinks(),
		]);

		if (gamesError || genresError || systemsError) {
			return [gamesError ?? genresError ?? systemsError, []];
		}

		const videoGames: VideoGame[] = [];

		games.forEach((row) => {
			videoGames.push({
				videoGameId: row.VideoGameId,
				videoGameStatusId: row.VideoGameStatusId,
				videoGameCompletionId: row.VideoGameCompletionId,
				title: row.Title,
				link: row.Link,
				dateStarted: convertDateToJsonDate(row.DateStarted),
				dateCompleted: convertDateToJsonDate(row.DateCompleted),
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
				genres: genres
					.filter((g) => g.videoGameId === row.VideoGameId)
					.map((g) => ({ videoGameGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				systems: systems
					.filter((s) => s.videoGameId === row.VideoGameId)
					.map((s) => ({ videoGameSystemId: s.systemId, name: s.systemName, colorCode: s.systemColorCode })),
			});
		});

		return [null, videoGames];
	}

	static async GetCurrentVideoGames(): Promise<[error: string | null, videoGames: VideoGame[]]> {
		const [
			[gamesError, games],
			[genresError, genres],
			[systemsError, systems],
		] = await Promise.all([
			db.Query<VideoGameQueryReturn>(getCurrentVideoGames),
			this.GetAllVideoGameGenreLinks(),
			this.GetAllVideoGameSystemLinks(),
		]);

		if (gamesError || genresError || systemsError) {
			return [gamesError ?? genresError ?? systemsError, []];
		}

		const videoGames: VideoGame[] = [];

		games.forEach((row) => {
			videoGames.push({
				videoGameId: row.VideoGameId,
				videoGameStatusId: row.VideoGameStatusId,
				videoGameCompletionId: row.VideoGameCompletionId,
				title: row.Title,
				link: row.Link,
				dateStarted: convertDateToJsonDate(row.DateStarted),
				dateCompleted: convertDateToJsonDate(row.DateCompleted),
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
				genres: genres
					.filter((g) => g.videoGameId === row.VideoGameId)
					.map((g) => ({ videoGameGenreId: g.genreId, name: g.genreName, colorCode: g.genreColorCode })),
				systems: systems
					.filter((s) => s.videoGameId === row.VideoGameId)
					.map((s) => ({ videoGameSystemId: s.systemId, name: s.systemName, colorCode: s.systemColorCode })),
			});
		});

		return [null, videoGames];
	}

	static async GetVideoGameById(id: number): Promise<[error: string | null, videoGame: VideoGame | null]> {
		const [
			[gameError, game],
			[genreError, genres],
			[systemError, systems]
		] = await Promise.all([
			db.QuerySingle<VideoGameQueryReturn>(getVideoGameById, [id]),
			this.GetGenresForVideoGame(id),
			this.GetSystemsForVideoGame(id),
		]);

		if (gameError || genreError || systemError) {
			return [gameError ?? genreError ?? systemError, null];
		}

		if (!game) {
			return [null, null];
		}

		return [null, {
			videoGameId: game.VideoGameId,
			videoGameStatusId: game.VideoGameStatusId,
			videoGameCompletionId: game.VideoGameCompletionId,
			title: game.Title,
			link: game.Link,
			dateStarted: convertDateToJsonDate(game.DateStarted),
			dateCompleted: convertDateToJsonDate(game.DateCompleted),
			coverImageUrl: game.CoverImageUrl,
			sortOrder: game.SortOrder,
			rating: game.Rating,
			thoughts: game.Thoughts,
			status: {
				videoGameStatusId: game.VideoGameStatusId,
				name: game.VideoGameStatusName,
				colorCode: game.VideoGameStatusColor,
			},
			completion: {
				videoGameCompletionId: game.VideoGameCompletionId,
				name: game.VideoGameCompletionName,
				colorCode: game.VideoGameCompletionColor,
			},
			genres,
			systems,
		}];
	}

	static async AddVideoGameGenreLinks(genres: { videoGameId: number, genreId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < genres.length; i++) {
			const genre = genres[i];

			const err = await db.Execute(insertVideoGameGenreLink, [genre.videoGameId, genre.genreId]);

			if (err) {
				error = err;
			}
		}

		return error;
	}

	static async AddVideoGameSystemLinks(systems: { videoGameId: number, systemId: number }[]): Promise<string | null> {
		let error: string | null = null;

		for (let i = 0; i < systems.length; i++) {
			const system = systems[i];

			const err = await db.Execute(insertVideoGameSystemLink, [system.videoGameId, system.systemId]);

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

	static async AddVideoGame(videoGame: VideoGame): Promise<string | null> {
		const error = await db.Execute(insertVideoGame, [
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
		]);

		if (error) {
			return error;
		}

		const [idError, videoGameId] = await this.GetLastInsertedRowId();

		if (idError || !videoGameId) {
			return idError ?? 'Unable to get Video Game ID';
		}

		const genres = videoGame.genres.map((g) => ({ videoGameId, genreId: g.videoGameGenreId }));
		const systems = videoGame.systems.map((g) => ({ videoGameId, systemId: g.videoGameSystemId }));

		const [genresError, systemsError] = await Promise.all([
			this.AddVideoGameGenreLinks(genres),
			this.AddVideoGameSystemLinks(systems),
		]);

		return genresError ?? systemsError ?? null;
	};

	static async UpdateVideoGame(videoGame: VideoGame): Promise<string | null> {
		const [updateError, deleteGenresError, deleteSystemsError] = await Promise.all([
			db.Execute(updateVideoGame, [
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
			]),
			this.DeleteVideoGameGenreLinks(videoGame.videoGameId),
			this.DeleteVideoGameSystemLinks(videoGame.videoGameId),
		]);

		if (updateError || deleteGenresError || deleteSystemsError) {
			return updateError ?? deleteGenresError ?? deleteSystemsError;
		}

		const genres = videoGame.genres.map((g) => ({ videoGameId: videoGame.videoGameId, genreId: g.videoGameGenreId }));
		const systems = videoGame.systems.map((g) => ({ videoGameId: videoGame.videoGameId, systemId: g.videoGameSystemId }));

		const [genresError, systemsError] = await Promise.all([
			this.AddVideoGameGenreLinks(genres),
			this.AddVideoGameSystemLinks(systems),
		]);

		return genresError ?? systemsError ?? null;
	};

	static async DeleteVideoGame(videoGameId: number): Promise<string | null> {
		const [deleteGenreError, deleteSystemError] = await Promise.all([
			this.DeleteVideoGameGenreLinks(videoGameId),
			this.DeleteVideoGameSystemLinks(videoGameId),
		]);

		if (deleteGenreError || deleteSystemError) {
			return deleteGenreError ?? deleteSystemError;
		}

		return await db.Execute(deleteVideoGame, [videoGameId]);
	};

	static async DeleteVideoGameGenreLinks(videoGameId: number): Promise<string | null> {
		return await db.Execute(clearVideoGameGenreLinks, [videoGameId]);
	}

	static async DeleteVideoGameSystemLinks(videoGameId: number): Promise<string | null> {
		return await db.Execute(clearVideoGameSystemLinks, [videoGameId]);
	}

	static async GetAllVideoGameGenreLinks(): Promise<[error: string | null, genreLinks: VideoGameGenreLink[]]> {
		const [error, data] = await db.Query<VideoGameGenreLinkQueryReturn>(getAllVideoGameGenreLinks);

		if (error) {
			return [error, []];
		}

		const genreLinks: VideoGameGenreLink[] = [];

		data.forEach((row) => {
			genreLinks.push({
				videoGameId: row.VideoGameId,
				genreId: row.VideoGameGenreId,
				genreName: row.VideoGameGenreName,
				genreColorCode: row.VideoGameGenreColor,
			});
		});

		return [null, genreLinks];
	};

	static async GetAllVideoGameSystemLinks(): Promise<[error: string | null, systemLinks: VideoGameSystemLink[]]> {
		const [error, data] = await db.Query<VideoGameSystemLinkQueryReturn>(getAllVideoGameSystemLinks);

		if (error) {
			return [error, []];
		}

		const systemLinks: VideoGameSystemLink[] = [];

		data.forEach((row) => {
			systemLinks.push({
				videoGameId: row.VideoGameId,
				systemId: row.VideoGameSystemId,
				systemName: row.VideoGameSystemName,
				systemColorCode: row.VideoGameSystemColor,
			});
		});

		return [null, systemLinks];
	};

	static async GetGenresForVideoGame(videoGameId: number): Promise<[error: string | null, genres: VideoGameGenre[]]> {
		const [error, data] = await db.Query<VideoGameGenreQueryReturn>(getGenresForVideoGame, [videoGameId]);

		if (error) {
			return [error, []];
		}

		const genres: VideoGameGenre[] = [];

		data.forEach((row) => {
			genres.push({
				videoGameGenreId: row.VideoGameGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});

		return [null, genres];
	};

	static async GetSystemsForVideoGame(videoGameId: number): Promise<[error: string | null, systems: VideoGameSystem[]]> {
		const [error, data] = await db.Query<VideoGameSystemQueryReturn>(getSystemsForVideoGame, [videoGameId]);

		if (error) {
			return [error, []];
		}

		const systems: VideoGameSystem[] = [];

		data.forEach((row) => {
			systems.push({
				videoGameSystemId: row.VideoGameSystemId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});

		return [null, systems];
	};

	static async GetAllVideoGameGenres(): Promise<[error: string | null, genres: VideoGameGenre[]]> {
		const [error, data] = await db.Query<VideoGameGenreQueryReturn>(getAllVideoGameGenres);

		if (error) {
			return [error, []];
		}

		const genres: VideoGameGenre[] = [];

		data.forEach((row) => {
			genres.push({
				videoGameGenreId: row.VideoGameGenreId,
				name: row.Name,
				colorCode: row.ColorCode,
				videoGameCount: row.VideoGameCount,
			});
		});

		return [null, genres];
	};

	static async GetVideoGameGenreById(id: number): Promise<[error: string | null, genre: VideoGameGenre | null]> {
		const [error, data] = await db.QuerySingle<VideoGameGenreQueryReturn>(getVideoGameGenreById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			videoGameGenreId: data.VideoGameGenreId,
			name: data.Name,
			colorCode: data.ColorCode,
			videoGameCount: data.VideoGameCount,
		}];
	};

	static async AddVideoGameGenre(genre: VideoGameGenre): Promise<string | null> {
		return await db.Execute(insertVideoGameGenre, [genre.name, genre.colorCode]);
	};

	static async UpdateVideoGameGenre(genre: VideoGameGenre): Promise<string | null> {
		return await db.Execute(updateVideoGameGenre, [
			genre.name,
			genre.colorCode,
			genre.videoGameGenreId,
		]);
	};

	static async DeleteVideoGameGenre(genreId: number): Promise<string | null> {
		return await db.Execute(deleteVideoGameGenre, [genreId]);
	};

	static async GetAllVideoGameSystems(): Promise<[error: string | null, systems: VideoGameSystem[]]> {
		const [error, data] = await db.Query<VideoGameSystemQueryReturn>(getAllVideoGameSystems);

		if (error) {
			return [error, []];
		}

		const systems: VideoGameSystem[] = [];

		data.forEach((row) => {
			systems.push({
				videoGameSystemId: row.VideoGameSystemId,
				name: row.Name,
				colorCode: row.ColorCode,
				videoGameCount: row.VideoGameCount,
			});
		});

		return [null, systems];
	};

	static async GetVideoGameSystemById(id: number): Promise<[error: string | null, system: VideoGameSystem | null]> {
		const [error, data] = await db.QuerySingle<VideoGameSystemQueryReturn>(getVideoGameSystemById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			videoGameSystemId: data.VideoGameSystemId,
			name: data.Name,
			colorCode: data.ColorCode,
			videoGameCount: data.VideoGameCount,
		}];
	};

	static async AddVideoGameSystem(system: VideoGameSystem): Promise<string | null> {
		return await db.Execute(insertVideoGameSystem, [system.name, system.colorCode]);
	}

	static async UpdateVideoGameSystem(system: VideoGameSystem): Promise<string | null> {
		return await db.Execute(updateVideoGameSystem, [
			system.name,
			system.colorCode,
			system.videoGameSystemId,
		]);
	}

	static async DeleteVideoGameSystem(systemId: number): Promise<string | null> {
		return await db.Execute(deleteVideoGameSystem, [systemId]);
	}
};

export { VideoGameRepository };
