export type PodcastCategory = {
    podcastCategoryId: number;
    name: string;
    colorCode: string;
    podcastCount?: number;
}

export type Podcast = {
    podcastId: number;
    podcastCategoryId: number;
    name: string;
    link: string;
    coverImageUrl: string;
    category: PodcastCategory;
}

export type PodcastQueryReturn = {
    PodcastId: number;
    Name: string;
    Link: string;
    CoverImageUrl: string;
    PodcastCategoryId: number;
    PodcastCategoryName: string;
    ColorCode: string;
}

export type PodcastCategoryQueryReturn = {
    PodcastCategoryId: number;
    Name: string;
    ColorCode: string;
    PodcastCount: number;
}