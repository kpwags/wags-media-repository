namespace WagsMediaRepository.Domain.Dtos;

public class BookDto
{
    public int BookId { get; set; }
    
    public int BookStatusId { get; set; }
    
    public int BookTypeId { get; set; }
    
    public int? BookSeriesId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string SubTitle { get; set; } = string.Empty;
    
    public string Author { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public DateTime? DateStarted { get; set; }
    
    public DateTime? DateCompleted { get; set; }
    
    public int Rating { get; set; }

    public string BookNotesUrl { get; set; } = string.Empty;
    
    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public bool IsAtLibrary { get; set; }

    public int CurrentPage { get; set; } = 1;

    public int PageCount { get; set; }
    
    public int? SortOrder { get; set; }

    public BookStatusDto BookStatus { get; set; } = new();
    
    public BookTypeDto BookType { get; set; } = new();
    
    public BookSeriesDto? BookSeries { get; set; }

    public List<BookToBookGenreDto> BookToBookGenres { get; set; } = [];
    
    public List<BookToBookFormatDto> BookToBookFormats { get; set; } = [];
}