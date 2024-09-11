import { VideoGenre, VideoService } from './System';

export type TelevsionStatus = {
    televisionStatusId: number;
    name: string;
    colorCode: string;
}

export type TelevisionShow = {
    televisionShowId: number;
    title: string;
    imdbLink: string;
    coverImageUrl: string;
    rating: number;
    thoughts: string;
    sortOrder?: number;
    statusId: number;
    seasonEpisodeCount: number;
    currentSeasonEpisode: number;
    progress: number;
    status?: TelevsionStatus;
    genres: VideoGenre[];
    services: VideoService[];
}