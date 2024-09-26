namespace WagsMediaRepository.Domain.Models;

public class MovieGenre
{
    public int MovieGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static MovieGenre FromDto(MovieGenreDto dto) => new()
    {
        MovieGenreId = dto.MovieGenreId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}