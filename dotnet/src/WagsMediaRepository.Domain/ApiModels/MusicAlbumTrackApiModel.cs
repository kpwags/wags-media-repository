namespace WagsMediaRepository.Domain.ApiModels;

public class MusicAlbumTrackApiModel
{
    public int MusicAlbumTrackId { get; set; }
    
    public int MusicAlbumId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public int TrackNumber { get; set; }

    public static MusicAlbumTrackApiModel FromDomainModel(MusicAlbumTrack domainModel) => new()
    {
        MusicAlbumTrackId = domainModel.MusicAlbumTrackId,
        MusicAlbumId = domainModel.MusicAlbumId,
        Title = domainModel.Title,
        TrackNumber = domainModel.TrackNumber,
    };
}