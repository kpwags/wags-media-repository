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
	dateStarted?: Date | string | null;
	dateCompleted?: Date | string | null;
	rating: number;
	thoughts: string;
	coverImageUrl: string;
	sortOrder?: number;
	status?: VideoGameStatus;
	completion?: VideoGameCompletion;
	genres: VideoGameGenre[];
	systems: VideoGameSystem[];
}

export type VideoGameGenreLink = {
	videoGameId: number;
	genreId: number;
	genreName: string;
	genreColorCode: string;
}

export type VideoGameSystemLink = {
	videoGameId: number;
	systemId: number;
	systemName: string;
	systemColorCode: string;
}

export type VideoGameQueryReturn = {
	VideoGameId: number;
	VideoGameStatusId: number;
	VideoGameCompletionId: number;
	Title: string;
	Link: string;
	DateStarted?: Date;
	DateCompleted?: Date;
	Rating: number;
	Thoughts: string;
	CoverImageUrl: string;
	SortOrder?: number;
	VideoGameStatusName: string;
	VideoGameStatusColor: string;
	VideoGameCompletionName: string;
	VideoGameCompletionColor: string;
}

export type VideoGameGenreLinkQueryReturn = {
	VideoGameId: number;
	VideoGameGenreId: number;
	VideoGameGenreName: string;
	VideoGameGenreColor: string;
}

export type VideoGameSystemLinkQueryReturn = {
	VideoGameId: number;
	VideoGameSystemId: number;
	VideoGameSystemName: string;
	VideoGameSystemColor: string;
}

export type VideoGameGenreQueryReturn = {
	VideoGameGenreId: number;
	Name: string;
	ColorCode: string;
	VideoGameCount: number;
}

export type VideoGameSystemQueryReturn = {
	VideoGameSystemId: number;
	Name: string;
	ColorCode: string;
	VideoGameCount: number;
}
