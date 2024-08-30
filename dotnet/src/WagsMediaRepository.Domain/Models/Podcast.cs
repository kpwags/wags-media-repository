namespace WagsMediaRepository.Domain.Models;

public class Podcast
{
    public int PodcastId { get; set; }
    
    public int PodcastCategoryId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;

    public PodcastCategory Category { get; set; } = new();

    public static Podcast FromDto(PodcastDto dto) => new()
    {
        PodcastId = dto.PodcastId,
        PodcastCategoryId = dto.PodcastCategoryId,
        Name = dto.Name,
        Link = dto.Link,
        CoverImageUrl = dto.CoverImageUrl,
        Category = PodcastCategory.FromDto(dto.PodcastCategory),
    };
}