import { VideoGenre, VideoService } from './system';

export type MovieStatus = {
    movieStatusId: number;
    name: string;
    colorCode: string;
}

export type Movie = {
    movieId: number;
    title: string;
    imdbLink: string;
    posterImageUrl: string;
    dateWatched?: Date | string | null;
    rating: number;
    thoughts: string;
    sortOrder?: number;
    statusId: number;
    status?: MovieStatus;
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