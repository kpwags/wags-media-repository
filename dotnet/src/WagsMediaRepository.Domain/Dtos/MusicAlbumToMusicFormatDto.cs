namespace WagsMediaRepository.Domain.Dtos;

public class MusicAlbumToMusicFormatDto
{
    public int MusicAlbumToMusicFormatId { get; set; }
    
    public int MusicAlbumId { get; set; }
    
    public int MusicFormatId { get; set; }

    public MusicAlbumDto MusicAlbum { get; set; } = new();

    public MusicFormatDto MusicFormat { get; set; } = new();
}