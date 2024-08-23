namespace WagsMediaRepository.Domain.Models;

public class VideoGameSystem
{
    public int VideoGameSystemId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static VideoGameSystem FromDto(VideoGameSystemDto dto) => new()
    {
        VideoGameSystemId = dto.VideoGameSystemId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}