namespace WagsMediaRepository.Domain.Dtos;

public class PodcastCategoryDto
{
    public int PodcastCategoryId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<PodcastDto> Podcasts { get; set; } = [];
}