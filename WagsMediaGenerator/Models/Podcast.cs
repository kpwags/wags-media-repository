namespace WagsMediaGenerator.Models;

public class Podcast
{
    public int PodcastId { get; set; }
    
    public int PodcastCategoryId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;

    public Tag Category { get; set; } = new();
}