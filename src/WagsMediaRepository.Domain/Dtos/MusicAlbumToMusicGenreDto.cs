namespace WagsMediaRepository.Domain.Dtos;

public class MusicAlbumToMusicGenreDto
{
    public int MusicAlbumToMusicGenreId { get; set; }
    
    public int MusicAlbumId { get; set; }
    
    public int MusicGenreId { get; set; }

    public MusicAlbumDto MusicAlbum { get; set; } = new();

    public MusicGenreDto MusicGenre { get; set; } = new();
}