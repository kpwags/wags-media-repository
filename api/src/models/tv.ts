import { VideoGenre, VideoService } from './system';

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

export type TelevisionShowGenreLink = {
	televisionShowId: number;
	genreId: number;
	genreName: string;
	genreColorCode: string;
}

export type TelevisionShowServiceLink = {
	televisionShowId: number;
	serviceId: number;
	serviceName: string;
	serviceColorCode: string;
}

export type TvQueryReturn = {
	TelevisionShowId: number;
	ImdbLink: string;
	TelevisionStatusId: number;
	CoverImageUrl: string;
	Rating: number;
	Thoughts: string;
	Title: string;
	SortOrder: number;
	SeasonEpisodeCount: number;
	CurrentSeasonEpisode: number;
	TelevsionShowStatusName: string;
	TelevsionShowStatusColor: string;
}

export type TvGenreLinkQueryReturn = {
	TelevisionShowId: number;
	VideoGenreId: number;
	VideoGenreName: string;
	VideoGenreColor: string;
}

export type TvServiceLinkQueryReturn = {
	TelevisionShowId: number;
	VideoServiceId: number;
	VideoServiceName: string;
	VideoServiceColor: string;
}