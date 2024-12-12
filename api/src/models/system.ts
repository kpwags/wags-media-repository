export type VideoGenre = {
    videoGenreId: number;
    name: string;
    colorCode: string;
    tvShowCount?: number;
    movieCount?: number;
}

export type VideoService = {
    videoServiceId: number;
    name: string;
    colorCode: string;
    tvShowCount?: number;
    movieCount?: number;
}