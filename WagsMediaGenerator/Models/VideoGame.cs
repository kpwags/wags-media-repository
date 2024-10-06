namespace WagsMediaGenerator.Models;

public class VideoGame
{
    public int VideoGameId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public DateTime? DateStarted { get; set; }
    
    public DateTime? DateCompleted { get; set; }
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int? SortOrder { get; set; }

    public Tag Status { get; set; } = new();

    public Tag Completion = new();

    public List<Tag> Genres { get; set; } = [];
    
    public List<Tag> Systems { get; set; } = [];
}