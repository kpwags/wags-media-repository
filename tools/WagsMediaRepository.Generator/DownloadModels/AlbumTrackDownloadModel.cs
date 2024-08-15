using WagsMediaRepository.Domain.ApiModels;

namespace WagsMediaRepository.Generator.DownloadModels;

public class AlbumTrackDownloadModel
{
    public int TrackNumber { get; set; }
    
    public string Title { get; set; } = string.Empty;

    public static AlbumTrackDownloadModel FromApiModel(MusicAlbumTrackApiModel track) => new()
    {
        TrackNumber = track.TrackNumber,
        Title = track.Title,
    };
}