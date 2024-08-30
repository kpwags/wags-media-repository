namespace WagsMediaRepository.Domain.ApiModels;

public class MusicAlbumApiModel
{
    public int MusicAlbumId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Artist { get; set; } = string.Empty;

    public string Thoughts { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
    
    public bool IsTopTen { get; set; }
    
    public bool ShowOnNowPage { get; set; }

    public IReadOnlyCollection<MusicGenreApiModel> Genres { get; set; } = [];

    public IReadOnlyCollection<MusicFormatApiModel> Formats { get; set; } = [];

    public IReadOnlyCollection<MusicAlbumTrackApiModel> Tracks { get; set; } = [];

    public static MusicAlbumApiModel FromDomainModel(MusicAlbum domainModel) => new()
    {
        MusicAlbumId = domainModel.MusicAlbumId,
        Title = domainModel.Title,
        Artist = domainModel.Artist,
        Thoughts = domainModel.Thoughts,
        CoverImageUrl = domainModel.CoverImageUrl,
        IsTopTen = domainModel.IsTopTen,
        ShowOnNowPage = domainModel.ShowOnNowPage,
        Genres = domainModel.Genres.Select(MusicGenreApiModel.FromDomainModel).ToList(),
        Formats = domainModel.Formats.Select(MusicFormatApiModel.FromDomainModel).ToList(),
        Tracks = domainModel.Tracks
            .OrderBy(t => t.TrackNumber)
            .Select(MusicAlbumTrackApiModel.FromDomainModel)
            .ToList(),
    };
}