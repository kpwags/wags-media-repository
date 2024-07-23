namespace WagsMediaRepository.Domain.Models;

public class MusicGenre
{
    public int MusicGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static MusicGenre FromDto(MusicGenreDto dto) => new()
    {
        MusicGenreId = dto.MusicGenreId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}