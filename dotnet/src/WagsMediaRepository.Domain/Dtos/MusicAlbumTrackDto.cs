namespace WagsMediaRepository.Domain.Dtos;

public class MusicAlbumTrackDto
{
    public int MusicAlbumTrackId { get; set; }
    
    public int MusicAlbumId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public int TrackNumber { get; set; }

    public MusicAlbumDto MusicAlbum { get; set; } = new();
}