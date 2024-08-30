namespace WagsMediaRepository.Domain.Models;

public class MovieService
{
    public int MovieServiceId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static MovieService FromDto(MovieServiceDto dto) => new()
    {
        MovieServiceId = dto.MovieServiceId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}