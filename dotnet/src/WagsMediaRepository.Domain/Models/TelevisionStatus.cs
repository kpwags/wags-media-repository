namespace WagsMediaRepository.Domain.Models;

public class TelevisionStatus
{
    public int TelevisionStatusId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static TelevisionStatus FromDto(TelevisionStatusDto dto) => new()
    {
        TelevisionStatusId = dto.TelevisionStatusId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}