import { db } from '@lib/db';

import convertDateToJsonDate from '@lib/convertDateToJsonDate';

import {
	LinkCategoryQueryReturn,
	LinkQueryReturn,
	Link,
	LinkCategory
} from '@models/link';

import {
	getLinkCategories,
	getLinkCategoryById,
	insertLinkCategory,
	updateLinkCategory,
	deleteLinkCategory,
	getLinks,
	getLinksForReadingLogIssue,
	getLinkById,
	insertLink,
	updateLink,
	deleteLink,
} from '@queries/link';

class LinkRepository {
	static async GetAllLinkCatgeories(): Promise<[error: string | null, categories: LinkCategory[]]> {
		const [error, data] = await db.Query<LinkCategoryQueryReturn>(getLinkCategories);

		if (error) {
			return [error, []];
		}

		const categories: LinkCategory[] = [];

		data.forEach((row) => {
			categories.push({
				linkCategoryId: row.LinkCategoryId,
				name: row.Name,
				colorCode: row.ColorCode,
				linkCount: row.LinkCount,
			});
		});

		return [null, categories];
	};

	static async GetLinkCategoryById(id: number): Promise<[error: string | null, linkCategory: LinkCategory | null]> {
		const [error, data] = await db.QuerySingle<LinkCategoryQueryReturn>(getLinkCategoryById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			linkCategoryId: data.LinkCategoryId,
			name: data.Name,
			colorCode: data.ColorCode,
			linkCount: data.LinkCount,
		}];
	};

	static async AddLinkCategory(category: LinkCategory): Promise<string | null> {
		return db.Execute(insertLinkCategory, [category.name, category.colorCode]);
	};

	static async UpdateLinkCategory(category: LinkCategory): Promise<string | null> {
		return db.Execute(updateLinkCategory, [
			category.name,
			category.colorCode,
			category.linkCategoryId,
		]);
	};

	static async DeleteLinkCategory(id: number): Promise<string | null> {
		return db.Execute(deleteLinkCategory, [id]);
	};

	static async GetAllLinks(): Promise<[error: string | null, links: Link[]]> {
		const [error, data] = await db.Query<LinkQueryReturn>(getLinks);

		if (error) {
			return [error, []];
		}

		const links: Link[] = [];

		data.forEach((row) => {
			links.push({
				linkId: row.LinkId,
				linkTypeId: row.LinkTypeId,
				linkCategoryId: row.LinkCategoryId,
				title: row.Title,
				author: row.Author,
				url: row.Url,
				linkDate: convertDateToJsonDate(row.LinkDate),
				readingLogIssueNumber: row.ReadingLogIssueNumber,
				category: {
					linkCategoryId: row.LinkCategoryId,
					name: row.LinkCategoryName,
					colorCode: row.LinkCategoryColor,
				},
				type: {
					linkTypeId: row.LinkTypeId,
					name: row.LinkTypeName,
					colorCode: row.LinkTypeColor,
				},
			});
		});

		return [null, links];
	};

	static async GetLinksForReadingLogIssue(id: number): Promise<[error: string | null, links: Link[]]> {
		const [error, data] = await db.Query<LinkQueryReturn>(getLinksForReadingLogIssue, [id]);

		if (error) {
			return [error, []];
		}

		const links: Link[] = [];

		data.forEach((row) => {
			links.push({
				linkId: row.LinkId,
				linkTypeId: row.LinkTypeId,
				linkCategoryId: row.LinkCategoryId,
				title: row.Title,
				author: row.Author,
				url: row.Url,
				linkDate: convertDateToJsonDate(row.LinkDate),
				readingLogIssueNumber: row.ReadingLogIssueNumber,
				category: {
					linkCategoryId: row.LinkCategoryId,
					name: row.LinkCategoryName,
					colorCode: row.LinkCategoryColor,
				},
				type: {
					linkTypeId: row.LinkTypeId,
					name: row.LinkTypeName,
					colorCode: row.LinkTypeColor,
				},
			});
		});

		return [null, links];
	};

	static async GetLinkById(id: number): Promise<[error: string | null, podcast: Link | null]> {
		const [error, data] = await db.QuerySingle<LinkQueryReturn>(getLinkById, [id]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			linkId: data.LinkId,
			linkTypeId: data.LinkTypeId,
			linkCategoryId: data.LinkCategoryId,
			title: data.Title,
			author: data.Author,
			url: data.Url,
			linkDate: convertDateToJsonDate(data.LinkDate),
			readingLogIssueNumber: data.ReadingLogIssueNumber,
			category: {
				linkCategoryId: data.LinkCategoryId,
				name: data.LinkCategoryName,
				colorCode: data.LinkCategoryColor,
			},
			type: {
				linkTypeId: data.LinkTypeId,
				name: data.LinkTypeName,
				colorCode: data.LinkTypeColor,
			},
		}];
	};

	static async AddLink(link: Link): Promise<string | null> {
		return await db.Execute(insertLink, [
			link.linkTypeId,
			link.linkCategoryId,
			link.title,
			link.url,
			link.author,
			link.linkDate,
			link.readingLogIssueNumber,
		]);
	};

	static async UpdateLink(link: Link): Promise<string | null> {
		return await db.Execute(updateLink, [
			link.linkTypeId,
			link.linkCategoryId,
			link.title,
			link.url,
			link.author,
			link.linkDate,
			link.readingLogIssueNumber,
			link.linkId
		]);
	};

	static async DeleteLink(id: number): Promise<string | null> {
		return await db.Execute(deleteLink, [id]);
	};
}

export default LinkRepository;
