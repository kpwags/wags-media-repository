namespace WagsMediaRepository.Domain.Models;

public class MusicAlbumTrack
{
    public int MusicAlbumTrackId { get; set; }
    
    public int MusicAlbumId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public int TrackNumber { get; set; }

    public static MusicAlbumTrack FromDto(MusicAlbumTrackDto dto) => new()
    {
        MusicAlbumTrackId = dto.MusicAlbumTrackId,
        MusicAlbumId = dto.MusicAlbumId,
        Title = dto.Title,
        TrackNumber = dto.TrackNumber,
    };
}