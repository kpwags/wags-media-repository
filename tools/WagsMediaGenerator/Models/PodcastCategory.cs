namespace WagsMediaGenerator.Models;

public class PodcastCategory
{
    public int PodcastCategoryId { get; set; }
    
    public string Name { get; set; } = string.Empty;

    public string ColorCode { get; set; } = string.Empty;
}