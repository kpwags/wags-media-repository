export type PodcastCategory = {
    podcastCategoryId: number;
    name: string;
    colorCode: string;
}

export type Podcast = {
    podcastId: number;
    podcastCategoryId: number;
    name: string;
    link: string;
    coverImageUrl: string;
    category: PodcastCategory;
}
