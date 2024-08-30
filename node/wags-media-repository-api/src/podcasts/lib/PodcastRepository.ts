import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
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
	deletePodcastCategory,
	updatePodcastCategory,
} from './queries';

class PodcastRepository {
	private static GetDatabase = () => new sqlite3.Database(config.db);

	static readonly GetAllPodcasts = (callback: (error: string | null, podcasts: Podcast[]) => void) => {
		const db = this.GetDatabase();

		const podcasts: Podcast[] = [];

		db.all(getPodcasts, (err: any, rows: PodcastQueryReturn[]) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err), []);
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

			return callback(null, podcasts);
		});
	};

	static readonly GetPodcastById = (id: number, callback: (error: string | null, podcast: Podcast | null) => void) => {
		const db = this.GetDatabase();

		db.get(getPodcastById, [id], (err, row: PodcastQueryReturn) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err), null);
			}

			if (!row) {
				return callback(null, null);
			}

			return callback(null, {
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

	static readonly AddPodcast = (podcast: Podcast, callback: (error: string | null) => void) => {
		const db = this.GetDatabase();

		db.run(insertPodcast, [podcast.name, podcast.link, podcast.coverImageUrl, podcast.podcastCategoryId], (err) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err));
			}

			return callback(null);
		});
	};

	static readonly UpdatePodcast = (podcast: Podcast, callback: (error: string | null) => void) => {
		const db = this.GetDatabase();

		db.run(updatePodcast, [
			podcast.podcastCategoryId,
			podcast.name,
			podcast.link,
			podcast.coverImageUrl,
			podcast.podcastId,
		], (err) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err));
			}

			return callback(null);
		});
	};

	static readonly DeletePodcast = (podcastId: number, callback: (error: string | null) => void) => {
		const db = this.GetDatabase();

		db.run(deletePodcast, [podcastId], (err) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err));
			}

			return callback(null);
		});
	};

	static readonly GetAllPodcastCategories = (callback: (error: string | null, categories: PodcastCategory[]) => void) => {
		const db = this.GetDatabase();

		const categories: PodcastCategory[] = [];

		db.all(getPodcastCategories, (err: any, rows: PodcastCategoryQueryReturn[]) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err), []);
			}

			rows.forEach((row) => {
				categories.push({
					podcastCategoryId: row.PodcastCategoryId,
					name: row.Name,
					colorCode: row.ColorCode,
				});
			});

			return callback(null, categories);
		});
	};

	static readonly GetPodcastCategoryById = (id: number, callback: (error: string | null, podcast: PodcastCategory | null) => void) => {
		const db = this.GetDatabase();

		db.get(getPodcastCategoryById, [id], (err, row: PodcastCategoryQueryReturn) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err), null);
			}

			if (!row) {
				return callback(null, null);
			}

			return callback(null, {
				podcastCategoryId: row.PodcastCategoryId,
				name: row.Name,
				colorCode: row.ColorCode,
			});
		});
	};

	static readonly AddPodcastCategory = (category: PodcastCategory, callback: (error: string | null) => void) => {
		const db = this.GetDatabase();

		db.run(insertPodcastCategory, [category.name, category.colorCode], (err) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err));
			}

			return callback(null);
		});
	};

	static readonly UpdatePodcastCategory = (category: PodcastCategory, callback: (error: string | null) => void) => {
		const db = this.GetDatabase();

		db.run(updatePodcastCategory, [
			category.name,
			category.colorCode,
			category.podcastCategoryId,
		], (err) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err));
			}

			return callback(null);
		});
	};

	static readonly DeletePodcastCategory = (podcastCategoryId: number, callback: (error: string | null) => void) => {
		const db = this.GetDatabase();

		db.run(deletePodcastCategory, [podcastCategoryId], (err) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err));
			}

			return callback(null);
		});
	};
}

export default PodcastRepository;
