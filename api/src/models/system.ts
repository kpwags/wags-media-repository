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

export type VideoGenreQueryReturn = {
    VideoGenreId: number;
    Name: string;
    ColorCode: string;
    TvShowCount: number;
    MovieCount: number;
}

export type VideoServiceQueryReturn = {
    VideoServiceId: number;
    Name: string;
    ColorCode: string;
    TvShowCount: number;
    MovieCount: number;
}