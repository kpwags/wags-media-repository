namespace WagsMediaGenerator.Models;

public class Movie
{
    public int MovieId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ImdbLink { get; set; } = string.Empty;
    
    public DateTime? DateWatched { get; set; }
    
    public int? SortOrder { get; set; }
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string PosterImageUrl { get; set; } = string.Empty;

    public Tag Status { get; set; } = new();

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];

    public IReadOnlyCollection<Tag> Services { get; set; } = [];
}