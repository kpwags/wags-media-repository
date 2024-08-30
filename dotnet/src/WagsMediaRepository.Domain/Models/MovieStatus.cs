namespace WagsMediaRepository.Domain.Models;

public class MovieStatus
{
    public int MovieStatusId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static MovieStatus FromDto(MovieStatusDto dto) => new()
    {
        MovieStatusId = dto.MovieStatusId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}