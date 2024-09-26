namespace WagsMediaRepository.Domain.Models;

public class TelevisionGenre
{
    public int TelevisionGenreId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static TelevisionGenre FromDto(TelevisionGenreDto dto) => new()
    {
        TelevisionGenreId = dto.TelevisionGenreId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}