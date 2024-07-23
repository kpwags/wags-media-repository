namespace WagsMediaRepository.Domain.Models;

public class MusicFormat
{
    public int MusicFormatId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static MusicFormat FromDto(MusicFormatDto dto) => new()
    {
        MusicFormatId = dto.MusicFormatId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}