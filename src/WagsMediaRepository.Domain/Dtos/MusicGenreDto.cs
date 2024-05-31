namespace WagsMediaRepository.Domain.Dtos;

public class MusicGenreDto
{
    public int MusicGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<MusicAlbumToMusicGenreDto> MusicAlbumToMusicGenres { get; set; } = [];
}