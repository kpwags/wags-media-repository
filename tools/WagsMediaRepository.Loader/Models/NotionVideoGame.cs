namespace WagsMediaRepository.Loader.Models;

public class NotionVideoGame
{
    public string Title { get; set; } = string.Empty;
    
    public string CompletionStatus { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public string CoverUrl { get; set; } = string.Empty;
    
    public DateTime? DateStarted { get; set; }
    
    public DateTime? DateCompleted { get; set; }
    
    public string Platforms { get; set; } = string.Empty;
    
    public int Rating { get; set; }
    
    public string Thoughts { get; set; } = string.Empty;
    
    public string Status { get; set; } = string.Empty;
}