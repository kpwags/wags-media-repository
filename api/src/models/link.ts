export type LinkCategory = {
    linkCategoryId: number;
    name: string;
    colorCode: string;
    linkCount?: number;
}

export type LinkType = {
    linkTypeId: number;
    name: string;
    colorCode: string;
}

export type Link = {
    linkId: number;
    linkTypeId: number;
    linkCategoryId: number;
    title: string;
    url: string;
    author: string;
    linkDate: Date | string | null;
    readingLogIssueNumber: number;
    category?: LinkCategory;
    type?: LinkType;
}

export type LinkQueryReturn = {
    LinkId: number;
    LinkTypeId: number;
    Title: string;
    Url: string;
    Author: string;
    LinkDate: Date;
    ReadingLogIssueNumber: number;
    LinkCategoryId: number;
    LinkCategoryName: string;
    LinkCategoryColor: string;
    LinkTypeName: string;
    LinkTypeColor: string;
}

export type LinkCategoryQueryReturn = {
    LinkCategoryId: number;
    Name: string;
    ColorCode: string;
    LinkCount: number;
}
