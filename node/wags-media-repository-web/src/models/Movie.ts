import { VideoGenre, VideoService } from "./System";

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