namespace WagsMediaGenerator.Models;

public class TelevisionShow
{
    public int TelevisionShowId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string ImdbLink { get; set; } = string.Empty;
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int SeasonEpisodeCount { get; set; }
    
    public int CurrentSeasonEpisode { get; set; }

    public int Progress { get; set; }
    
    public int? SortOrder { get; set; }

    public Tag Status { get; set; } = new();

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];

    public IReadOnlyCollection<Tag> Services { get; set; } = [];
}