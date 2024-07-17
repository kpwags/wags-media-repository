namespace WagsMediaRepository.Loader.Models;

public class NotionMovie
{
    public string Title { get; set; } = string.Empty;
    
    public string Status { get; set; } = string.Empty;
    
    public string Services { get; set; } = string.Empty;
    
    public string Genres { get; set; } = string.Empty;
    
    public DateTime? DateWatched { get; set; }
    
    public string CoverUrl { get; set; } = string.Empty;
    
    public string ImdbLink { get; set; } = string.Empty;
    
    public int Rating { get; set; }
    
    public string Thoughts { get; set; } = string.Empty;
}