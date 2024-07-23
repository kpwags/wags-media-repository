namespace WagsMediaRepository.Loader.Models;

public class NotionBook
{
    public int BacklogId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Subtitle { get; set; } = string.Empty;
    
    public string Author { get; set; } = string.Empty;
    
    public string Type { get; set; } = string.Empty;
    
    public string Category { get; set; } = string.Empty;
    
    public string Status { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public string BookReviewUrl { get; set; } = string.Empty;
    
    public string Medium { get; set; } = string.Empty;
    
    public string CoverUrl { get; set; } = string.Empty;
    
    public int Rating { get; set; }
    
    public string Thoughts { get; set; } = string.Empty;
    
    public string Series { get; set; } = string.Empty;
    
    public int CurrentPage { get; set; }
    
    public int PageCount { get; set; }
    
    public bool Purchased { get; set; }
    
    public bool LibraryHasIt { get; set; }
    
    public DateTime? DateStarted { get; set; }
    
    public DateTime? DateCompleted { get; set; }
}