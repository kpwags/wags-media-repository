namespace WagsMediaRepository.Domain.Models;

public class TelevisionService
{
    public int TelevisionServiceId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static TelevisionService FromDto(TelevisionServiceDto dto) => new()
    {
        TelevisionServiceId = dto.TelevisionServiceId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}