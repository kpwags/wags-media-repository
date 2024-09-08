import { VideoGenre, VideoService } from './system';

export type Movie = {
    movieId: number;
    title: string;
    imdbLink: string;
    posterImageUrl: string;
    dateWatched: Date;
    rating: number;
    thoughts: string;
    sortOrder?: number;
    statusId: number;
    genres: VideoGenre[];
    services: VideoService[]
}

export type MovieGenreLink = {
    movieId: number;
    genreId: number;
    genreName: string;
    genreColorCode: string;
}

export type MovieServiceLink = {
    movieId: number;
    serviceId: number;
    serviceName: string;
    serviceColorCode: string;
}