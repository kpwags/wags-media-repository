namespace WagsMediaRepository.Domain.Models;

public class Book
{
    public int BookId { get; set; }
    
    public int BookStatusId { get; set; }
    
    public int BookTypeId { get; set; }
    
    public int? BookSeriesId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string SubTitle { get; set; } = string.Empty;

    public string FullTitle
    {
        get
        {
            if (string.IsNullOrWhiteSpace(SubTitle))
            {
                return Title;
            }

            return $"{Title}: {SubTitle}";
        }
    }
    
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

    public decimal PercentComplete
    {
        get
        {
            if (PageCount == 0)
            {
                return 0;
            }

            return Math.Round(((decimal)CurrentPage / (decimal)PageCount) * 100);
        }
    }
    
    public int? SortOrder { get; set; }

    public BookStatus Status { get; set; } = new();
    
    public BookType Type { get; set; } = new();
    
    public BookSeries? Series { get; set; }

    public List<BookGenre> Genres { get; set; } = [];
    
    public List<BookFormat> Formats { get; set; } = [];

    public static Book FromDto(BookDto dto) => new()
    {
        BookId = dto.BookId,
        BookStatusId = dto.BookStatusId,
        BookTypeId = dto.BookTypeId,
        BookSeriesId = dto.BookSeriesId,
        Title = dto.Title,
        SubTitle = dto.SubTitle,
        Author = dto.Author,
        Link = dto.Link,
        DateStarted = dto.DateStarted,
        DateCompleted = dto.DateCompleted,
        Rating = dto.Rating,
        BookNotesUrl = dto.BookNotesUrl,
        Thoughts = dto.Thoughts,
        CoverImageUrl = dto.CoverImageUrl,
        IsAtLibrary = dto.IsAtLibrary,
        IsPurchased = dto.IsPurchased,
        CurrentPage = dto.CurrentPage,
        PageCount = dto.PageCount,
        SortOrder = dto.SortOrder,
        Status = BookStatus.FromDto(dto.BookStatus),
        Type = BookType.FromDto(dto.BookType),
        Series = dto.BookSeries is not null ? BookSeries.FromDto(dto.BookSeries) : null,
        Genres = dto.BookToBookGenres.Select(bg => BookGenre.FromDto(bg.BookGenre)).ToList(),
        Formats = dto.BookToBookFormats.Select(bf => BookFormat.FromDto(bf.BookFormat)).ToList(),
    };
}