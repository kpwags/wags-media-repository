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
    linkDate: Date;
    readingLogIssueNumber: number;
    category?: LinkCategory;
    type?: LinkType;
}
