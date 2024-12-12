import sqlite3 from 'sqlite3';
import config from '../../config';
import cleanSqliteError from '../../lib/cleanSqliteError';
import convertDateToJsonDate from '../../lib/convertDateToJsonDate';
import { Link, LinkCategory } from '../../models/link';
import {
    LinkCategoryQueryReturn,
    LinkQueryReturn,
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
} from './queries';

class LinkRepository {
    private static GetDatabase = () => new sqlite3.Database(config.db);

    static readonly GetAllLinkCatgeories = (callback: (error: string | null, categories: LinkCategory[]) => void) => {
        const db = this.GetDatabase();

        const categories: LinkCategory[] = [];

        db.all(getLinkCategories, (err: any, rows: LinkCategoryQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
                categories.push({
                    linkCategoryId: row.LinkCategoryId,
                    name: row.Name,
                    colorCode: row.ColorCode,
                    linkCount: row.LinkCount,
                });
            });

            return callback(null, categories);
        });
    };

    static readonly GetLinkCategoryById = (id: number, callback: (error: string | null, linkCategory: LinkCategory | null) => void) => {
        const db = this.GetDatabase();

        db.get(getLinkCategoryById, [id], (err, row: LinkCategoryQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
                linkCategoryId: row.LinkCategoryId,
                name: row.Name,
                colorCode: row.ColorCode,
                linkCount: row.LinkCount,
            });
        });
    };

    static readonly AddLinkCategory = (category: LinkCategory, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertLinkCategory, [category.name, category.colorCode], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateLinkCategory = (category: LinkCategory, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateLinkCategory, [
            category.name,
            category.colorCode,
            category.linkCategoryId,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteLinkCategory = (linkCategoryId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteLinkCategory, [linkCategoryId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly GetAllLinks = (callback: (error: string | null, links: Link[]) => void) => {
        const db = this.GetDatabase();

        const links: Link[] = [];

        db.all(getLinks, (err: any, rows: LinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
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

            return callback(null, links);
        });
    };

    static readonly GetLinksForReadingLogIssue = (id: number, callback: (error: string | null, links: Link[]) => void) => {
        const db = this.GetDatabase();

        const links: Link[] = [];

        db.all(getLinksForReadingLogIssue, [id], (err: any, rows: LinkQueryReturn[]) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), []);
            }

            rows.forEach((row) => {
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

            return callback(null, links);
        });
    };

    static readonly GetLinkById = (id: number, callback: (error: string | null, podcast: Link | null) => void) => {
        const db = this.GetDatabase();

        db.get(getLinkById, [id], (err, row: LinkQueryReturn) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err), null);
            }

            if (!row) {
                return callback(null, null);
            }

            return callback(null, {
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
    };

    static readonly AddLink = (link: Link, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(insertLink, [
            link.linkTypeId,
            link.linkCategoryId,
            link.title,
            link.url,
            link.author,
            link.linkDate,
            link.readingLogIssueNumber,
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly UpdateLink = (link: Link, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(updateLink, [
            link.linkTypeId,
            link.linkCategoryId,
            link.title,
            link.url,
            link.author,
            link.linkDate,
            link.readingLogIssueNumber,
            link.linkId
        ], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };

    static readonly DeleteLink = (linkId: number, callback: (error: string | null) => void) => {
        const db = this.GetDatabase();

        db.run(deleteLink, [linkId], (err) => {
            db.close();

            if (err) {
                return callback(cleanSqliteError(err));
            }

            return callback(null);
        });
    };
}

export default LinkRepository;
