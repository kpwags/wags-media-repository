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
