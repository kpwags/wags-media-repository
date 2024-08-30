namespace WagsMediaRepository.Domain.ApiModels;

public class BookApiModel
{
    public int BookId { get; set; }
    
    public int BookStatusId { get; set; }
    
    public int BookTypeId { get; set; }
    
    public int? BookSeriesId { get; set; }

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

    public BookStatusApiModel Status { get; set; } = new();
    
    public BookTypeApiModel Type { get; set; } = new();
    
    public BookSeriesApiModel? Series { get; set; }

    public IReadOnlyCollection<BookGenreApiModel> Genres { get; set; } = [];
    
    public IReadOnlyCollection<BookFormatApiModel> Formats { get; set; } = [];

    public static BookApiModel FromDomainModel(Book domainModel) => new()
    {
        BookId = domainModel.BookId,
        BookStatusId = domainModel.BookStatusId,
        BookTypeId = domainModel.BookTypeId,
        BookSeriesId = domainModel.BookSeriesId,
        Title = domainModel.Title,
        FullTitle = domainModel.FullTitle,
        SubTitle = domainModel.SubTitle,
        Author = domainModel.Author,
        Link = domainModel.Link,
        DateStarted = domainModel.DateStarted,
        DateCompleted = domainModel.DateCompleted,
        Rating = domainModel.Rating,
        BookNotesUrl = domainModel.BookNotesUrl,
        Thoughts = domainModel.Thoughts,
        CoverImageUrl = domainModel.CoverImageUrl,
        IsAtLibrary = domainModel.IsAtLibrary,
        IsPurchased = domainModel.IsPurchased,
        CurrentPage = domainModel.CurrentPage,
        PageCount = domainModel.PageCount,
        PercentComplete = domainModel.PercentComplete,
        SortOrder = domainModel.SortOrder,
        Status = BookStatusApiModel.FromDomainModel(domainModel.Status),
        Type = BookTypeApiModel.FromDomainModel(domainModel.Type),
        Series = domainModel.Series is not null ? BookSeriesApiModel.FromDomainModel(domainModel.Series) : null,
        Genres = domainModel.Genres.Select(BookGenreApiModel.FromDomainModel).ToList(),
        Formats = domainModel.Formats.Select(BookFormatApiModel.FromDomainModel).ToList(),
    };
}