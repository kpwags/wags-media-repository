namespace WagsMediaGenerator.Models;

public class Book
{
    public int BookId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string SubTitle { get; set; } = string.Empty;
    
    public string FullTitle { get; set; } = string.Empty;
    
    public string Author { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public DateTime? DateStarted { get; set; }
    
    public DateTime? DateCompleted { get; set; }
    
    public int Rating { get; set; }

    public string BookNotesUrl { get; set; } = string.Empty;
    
    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public bool IsAtLibrary { get; set; }
    
    public bool IsPurchased { get; set; }

    public int CurrentPage { get; set; } = 1;

    public int PageCount { get; set; }

    public int Progress { get; set; }
    
    public int? SortOrder { get; set; }

    public Tag Status { get; set; } = new();

    public Tag Type { get; set; } = new();
    
    public Tag? Series { get; set; }

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];
    
    public IReadOnlyCollection<Tag> Formats { get; set; } = [];
}