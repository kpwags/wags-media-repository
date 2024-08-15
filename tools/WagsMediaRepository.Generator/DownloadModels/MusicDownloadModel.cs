using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.Models;

namespace WagsMediaRepository.Generator.DownloadModels;

public class MusicDownloadModel
{
    public int MusicAlbumId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Artist { get; set; } = string.Empty;

    public string Thoughts { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
    
    public bool IsTopTen { get; set; }
    
    public bool ShowOnNowPage { get; set; }

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];

    public IReadOnlyCollection<Tag> Formats { get; set; } = [];

    public IReadOnlyCollection<AlbumTrackDownloadModel> Tracks { get; set; } = [];

    public static MusicDownloadModel FromApiModel(MusicAlbumApiModel album) => new()
    {
        MusicAlbumId = album.MusicAlbumId,
        Title = album.Title,
        Artist = album.Artist,
        Thoughts = album.Thoughts,
        CoverImageUrl = album.CoverImageUrl,
        IsTopTen = album.IsTopTen,
        ShowOnNowPage = album.ShowOnNowPage,
        Genres = album.Genres.Select(g => new Tag(g.Name, g.ColorCode)).ToList(),
        Formats = album.Formats.Select(f => new Tag(f.Name, f.ColorCode)).ToList(),
        Tracks = album.Tracks
            .OrderBy(t => t.TrackNumber)
            .Select(AlbumTrackDownloadModel.FromApiModel)
            .ToList(),
    };
}