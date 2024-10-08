export type VideoGameSystem = {
    videoGameSystemId: number;
    name: string;
    colorCode: string;
    videoGameCount?: number;
}

export type VideoGameGenre = {
    videoGameGenreId: number;
    name: string;
    colorCode: string;
    videoGameCount?: number;
}

export type VideoGameStatus = {
    videoGameStatusId: number;
    name: string;
    colorCode: string;
}

export type VideoGameCompletion = {
    videoGameCompletionId: number;
    name: string;
    colorCode: string;
}

export type VideoGame = {
    videoGameId: number;
    videoGameStatusId: number;
    videoGameCompletionId: number;
    title: string;
    link: string;
    dateStarted?: Date;
    dateCompleted?: Date;
    rating: number;
    thoughts: string;
    coverImageUrl: string;
    sortOrder?: number;
    status?: VideoGameStatus;
    completion?: VideoGameCompletion;
    genres: VideoGameGenre[];
    systems: VideoGameSystem[];
}
