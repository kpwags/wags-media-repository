namespace WagsMediaRepository.Domain.Dtos;

public class MusicAlbumDto
{
    public int MusicAlbumId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Artist { get; set; } = string.Empty;

    public string Thoughts { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
    
    public bool IsTopTen { get; set; }

    public List<MusicAlbumTrackDto> MusicAlbumTracks { get; set; } = [];
    
    public List<MusicAlbumToMusicFormatDto> MusicAlbumToMusicFormats { get; set; } = [];
        
    public List<MusicAlbumToMusicGenreDto> MusicAlbumToMusicGenres { get; set; } = [];
}