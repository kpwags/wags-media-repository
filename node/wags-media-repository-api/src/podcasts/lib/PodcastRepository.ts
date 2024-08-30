import sqlite3 from 'sqlite3';
import config from '../../config';

import { Podcast, PodcastCategory } from '../../models/podcast';
import {
	getPodcasts,
	getPodcastById,
	insertPodcast,
	deletePodcast,
	updatePodcast,
	getPodcastCategories,
	PodcastQueryReturn,
	PodcastCategoryQueryReturn,
	getPodcastCategoryById,
	insertPodcastCategory,
} from './queries';

class PodcastRepository {
	private static GetDatabase = () => new sqlite3.Database(config.db);

	static readonly GetAllPodcasts = (callback: (podcast: Podcast[]) => void) => {
		const db = this.GetDatabase();

		const podcasts: Podcast[] = [];

		db.all(getPodcasts, (err: any, rows: PodcastQueryReturn[]) => {
			if (err) {
				throw err;
			}

			rows.forEach((row) => {
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

			db.close();

			return callback(podcasts);
		});
	};

	static readonly GetPodcastById = (id: number, callback: (podcast: Podcast | null) => void) => {
		const db = this.GetDatabase();

		db.get(getPodcastById, [id], (err, row: PodcastQueryReturn) => {
			if (err) {
				throw err;
			}

			db.close();

			if (!row) {
				return callback(null);
			}

			return callback({
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
	};

	static readonly AddPodcast = (podcast: Podcast) => {
		const db = this.GetDatabase();

		db.run(insertPodcast, [podcast.name, podcast.link, podcast.coverImageUrl, podcast.podcastCategoryId], (err) => {
			if (err) {
				throw err;
			}

			db.close();
		});
	};

	static readonly UpdatePodcast = (podcast: Podcast) => {
		const db = this.GetDatabase();

		db.run(updatePodcast, [
			podcast.podcastCategoryId,
			podcast.name,
			podcast.link,
			podcast.coverImageUrl,
			podcast.podcastId,
		], (err) => {
			if (err) {
				throw err;
			}

			db.close();
		});
	};

	static readonly DeletePodcast = (podcastId: number) => {
		const db = this.GetDatabase();

		db.run(deletePodcast, [podcastId], (err) => {
			if (err) {
				console.log(err);
				throw err;
			}

			db.close();
		});
	};

	static readonly GetAllPodcastCategories = (callback: (categories: PodcastCategory[]) => void) => {
		const db = this.GetDatabase();

		const categories: PodcastCategory[] = [];

		db.all(getPodcastCategories, (err: any, rows: PodcastCategoryQueryReturn[]) => {
			if (err) {
				throw err;
			}

			rows.forEach((row) => {
				categories.push({
					podcastCategoryId: row.PodcastCategoryId,
					name: row.Name,
					colorCode: row.ColorCode,
				});
			});

			db.close();

			return callback(categories);
		});
	};

	static readonly GetPodcastCategoryById = (id: number, callback: (podcast: PodcastCategory | null) => void) => {
		const db = this.GetDatabase();

		db.get(getPodcastCategoryById, [id], (err, row: PodcastCategoryQueryReturn) => {
			if (err) {
				throw err;
			}

			db.close();

			if (!row) {
				return callback(null);
			}

			return callback({
				podcastCategoryId: row.PodcastCategoryId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});
	};

	static readonly AddPodcastCategory = (category: PodcastCategory) => {
		const db = this.GetDatabase();

		db.run(insertPodcastCategory, [category.name, category.colorCode], (err) => {
			if (err) {
				throw err;
			}

			db.close();
		});
	};

	static readonly UpdatePodcastCategory = (category: PodcastCategory) => {
		const db = this.GetDatabase();

		db.run(updatePodcast, [
			category.name,
			category.colorCode,
			category.podcastCategoryId,
		], (err) => {
			if (err) {
				throw err;
			}

			db.close();
		});
	};

	static readonly DeletePodcastCategory = (podcastCategoryId: number) => {
		const db = this.GetDatabase();

		db.run(deletePodcast, [podcastCategoryId], (err) => {
			if (err) {
				console.log(err);
				throw err;
			}

			db.close();
		});
	};
}

export default PodcastRepository;
