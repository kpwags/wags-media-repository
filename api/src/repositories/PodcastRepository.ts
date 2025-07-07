import { db } from '@lib/db';

import {
	Podcast,
	PodcastCategory,
	PodcastQueryReturn,
	PodcastCategoryQueryReturn,
} from '@models/podcast';

import {
	getPodcasts,
	getPodcastById,
	insertPodcast,
	deletePodcast,
	updatePodcast,
	getPodcastCategories,
	getPodcastCategoryById,
	insertPodcastCategory,
	deletePodcastCategory,
	updatePodcastCategory,
} from '@queries/podcast';

class PodcastRepository {
	static async GetAllPodcasts(): Promise<[error: string | null, podcasts: Podcast[]]> {
		const [error, data] = await db.Query<PodcastQueryReturn>(getPodcasts);

		if (error) {
			return [error, []];
		}

		const podcasts: Podcast[] = [];

		data.forEach((row) => {
			podcasts.push({
				podcastId: row.PodcastId,
				podcastCategoryId: row.PodcastCategoryId,
				name: row.Name,
				link: row.Link,
				coverImageUrl: row.CoverImageUrl,
				category: {
					podcastCategoryId: row.PodcastCategoryId,
					name: row.PodcastCategoryName,
					colorCode: row.ColorCode,
				}
			});
		});

		return [null, podcasts];
	}

	static async GetPodcastById(id: number): Promise<[error: string | null, podcast: Podcast | null]> {
		const [error, data] = await db.QuerySingle<PodcastQueryReturn>(getPodcastById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			podcastId: data.PodcastId,
			podcastCategoryId: data.PodcastCategoryId,
			name: data.Name,
			link: data.Link,
			coverImageUrl: data.CoverImageUrl,
			category: {
				podcastCategoryId: data.PodcastCategoryId,
				name: data.PodcastCategoryName,
				colorCode: data.ColorCode,
			}
		}];
	}

	static async AddPodcast(podcast: Podcast): Promise<string | null> {
		return await db.Execute(insertPodcast, [podcast.name, podcast.link, podcast.coverImageUrl, podcast.podcastCategoryId]);
	}

	static async UpdatePodcast(podcast: Podcast): Promise<string | null> {
		return await db.Execute(updatePodcast, [
			podcast.podcastCategoryId,
			podcast.name,
			podcast.link,
			podcast.coverImageUrl,
			podcast.podcastId,
		]);
	}

	static async DeletePodcast(id: number): Promise<string | null> {
		return await db.Execute(deletePodcast, [id]);
	}

	static async GetAllPodcastCategories(): Promise<[error: string | null, categories: PodcastCategory[]]> {
		const [error, data] = await db.Query<PodcastCategoryQueryReturn>(getPodcastCategories);

		if (error) {
			return [error, []];
		}

		const categories: PodcastCategory[] = [];

		data.forEach((row) => {
			categories.push({
				podcastCategoryId: row.PodcastCategoryId,
				name: row.Name,
				colorCode: row.ColorCode,
				podcastCount: row.PodcastCount,
			});
		});

		return [null, categories];
	};

	static async GetPodcastCategoryById(id: number): Promise<[error: string | null, podcast: PodcastCategory | null]> {
		const [error, data] = await db.QuerySingle<PodcastCategoryQueryReturn>(getPodcastCategoryById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			podcastCategoryId: data.PodcastCategoryId,
			name: data.Name,
			colorCode: data.ColorCode,
			podcastCount: data.PodcastCount,
		}];
	};

	static async AddPodcastCategory(category: PodcastCategory): Promise<string | null> {
		return await db.Execute(insertPodcastCategory, [category.name, category.colorCode]);
	};

	static async UpdatePodcastCategory(category: PodcastCategory): Promise<string | null> {
		return await db.Execute(updatePodcastCategory, [
			category.name,
			category.colorCode,
			category.podcastCategoryId,
		]);
	};

	static async DeletePodcastCategory(id: number): Promise<string | null> {
		return await db.Execute(deletePodcastCategory, [id]);
	};
}

export { PodcastRepository };
