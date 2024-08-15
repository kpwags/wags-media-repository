using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.Models;

namespace WagsMediaRepository.Generator.DownloadModels;

public class BookDownloadModel
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

    public decimal PercentComplete { get; set; }
    
    public int? SortOrder { get; set; }

    public Tag Status { get; set; } = new();

    public Tag Type { get; set; } = new();
    
    public Tag? Series { get; set; }

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];
    
    public IReadOnlyCollection<Tag> Formats { get; set; } = [];

    public static BookDownloadModel FromApiModel(BookApiModel book) => new()
    {
        BookId = book.BookId,
        Title = book.Title,
        FullTitle = book.FullTitle,
        SubTitle = book.SubTitle,
        Author = book.Author,
        Link = book.Link,
        DateStarted = book.DateStarted,
        DateCompleted = book.DateCompleted,
        Rating = book.Rating,
        BookNotesUrl = book.BookNotesUrl,
        Thoughts = book.Thoughts,
        CoverImageUrl = book.CoverImageUrl,
        IsAtLibrary = book.IsAtLibrary,
        IsPurchased = book.IsPurchased,
        CurrentPage = book.CurrentPage,
        PageCount = book.PageCount,
        PercentComplete = book.PercentComplete,
        SortOrder = book.SortOrder,
        Status = new Tag(book.Status.Name, book.Status.ColorCode),
        Type = new Tag(book.Type.Name, book.Type.ColorCode),
        Series = book.Series is not null ? new Tag(book.Series.Name, book.Series.ColorCode) : null,
        Genres = book.Genres.Select(g => new Tag(g.Name, g.ColorCode)).ToList(),
        Formats = book.Formats.Select(f => new Tag(f.Name, f.ColorCode)).ToList(),
    };
}