namespace WagsMediaRepository.Domain.Models;

public class PodcastCategory
{
    public int PodcastCategoryId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static PodcastCategory FromDto(PodcastCategoryDto dto) => new()
    {
        PodcastCategoryId = dto.PodcastCategoryId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}