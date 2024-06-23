namespace WagsMediaRepository.Domain.Dtos;

public class PodcastDto
{
    public int PodcastId { get; set; }
    
    public int PodcastCategoryId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;

    public PodcastCategoryDto PodcastCategory { get; set; } = new();
}