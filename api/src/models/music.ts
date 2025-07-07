export type MusicFormat = {
    musicFormatId: number;
    name: string;
    colorCode: string;
}

export type MusicGenre = {
    musicGenreId: number;
    name: string;
    colorCode: string;
    albumCount?: number;
}

export type AlbumTrack = {
    musicAlbumTrackId: number;
    musicAlbumId: number;
    trackNumber: number;
    title: string;
}

export type MusicAlbum = {
    musicAlbumId: number;
    title: string;
    artist: string;
    thoughts: string;
    coverImageUrl: string;
    isTopTen: boolean;
    showOnNowPage: boolean;
    formats: MusicFormat[];
    genres: MusicGenre[];
    tracks: AlbumTrack[];
}

export type MusicGenreLink = {
    musicAlbumId: number;
    genreId: number;
    genreName: string;
    genreColorCode: string;
}

export type MusicFormatLink = {
    musicAlbumId: number;
    formatId: number;
    formatName: string;
    formatColorCode: string;
}

export type MusicAlbumQueryReturn = {
    MusicAlbumId: number;
    Title: string;
    Artist: string;
    Thoughts: string;
    CoverImageUrl: string;
    IsTopTen: boolean;
    ShowOnNowPage: boolean;
}

export type AlbumTrackQueryReturn = {
    MusicAlbumTrackId: number;
    MusicAlbumId: number;
    TrackNumber: number;
    Title: string;
}

export type MusicGenreLinkQueryReturn = {
    MusicAlbumId: number;
    MusicGenreId: number;
    MusicGenreName: string;
    MusicGenreColor: string;
}

export type MusicFormatLinkQueryReturn = {
    MusicAlbumId: number;
    MusicFormatId: number;
    MusicFormatName: string;
    MusicFormatColor: string;
}

export type MusicGenreQueryReturn = {
    MusicGenreId: number;
    Name: string;
    ColorCode: string;
    MusicAlbumCount?: number;
}

export type MusicFormatQueryReturn = {
    MusicFormatId: number;
    Name: string;
    ColorCode: string;
}