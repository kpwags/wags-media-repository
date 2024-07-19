using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Books;

public class SaveBook
{
    public class Request : IRequest<OperationResult>
    {
        public int BookId { get; set; }
        
        [Required(ErrorMessage = "Status is required.")]
        public int BookStatusId { get; set; }
        
        [Required(ErrorMessage = "Type is required.")]
        public int BookTypeId { get; set; }
    
        public int? BookSeriesId { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;
    
        public string SubTitle { get; set; } = string.Empty;
    
        [Required(ErrorMessage = "Author is required.")]
        public string Author { get; set; } = string.Empty;
    
        [Required(ErrorMessage = "Link is required.")]
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
    
        public int? SortOrder { get; set; }

        public IList<int> GenreIds { get; set; } = [];

        public IList<int> FormatIds { get; set; } = [];
        
        public Request() { }

        public Request(BookApiModel book)
        {
            BookId = book.BookId;
            BookStatusId = book.BookStatusId;
            BookTypeId = book.BookTypeId;
            BookSeriesId = book.BookSeriesId;
            Title = book.Title;
            SubTitle = book.SubTitle;
            Author = book.Author;
            Link = book.Link;
            DateStarted = book.DateStarted;
            DateCompleted = book.DateCompleted;
            Rating = book.Rating;
            BookNotesUrl = book.BookNotesUrl;
            Thoughts = book.Thoughts;
            CoverImageUrl = book.CoverImageUrl;
            IsAtLibrary = book.IsAtLibrary;
            IsPurchased = book.IsPurchased;
            CurrentPage = book.CurrentPage;
            PageCount = book.PageCount;
            SortOrder = book.SortOrder;
            GenreIds = book.Genres.Select(g => g.BookGenreId).ToArray();
            FormatIds = book.Formats.Select(f => f.BookFormatId).ToArray();
        }

        public Book ConvertToBook() => new()
        {
            BookId = BookId,
            BookStatusId = BookStatusId,
            BookTypeId = BookTypeId,
            BookSeriesId = BookSeriesId,
            Title = Title,
            SubTitle = SubTitle,
            Author = Author,
            Link = Link,
            DateStarted = DateStarted,
            DateCompleted = DateCompleted,
            Rating = Rating,
            BookNotesUrl = BookNotesUrl,
            Thoughts = Thoughts,
            CoverImageUrl = CoverImageUrl,
            IsAtLibrary = IsAtLibrary,
            IsPurchased = IsPurchased,
            CurrentPage = CurrentPage,
            PageCount = PageCount,
            SortOrder = SortOrder,
            Genres = GenreIds.Select(g => new BookGenre { BookGenreId = g }).ToList(),
            Formats = FormatIds.Select(f => new BookFormat { BookFormatId = f }).ToList(),
        };
    }
    
    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.BookId > 0)
                {
                    await _bookRepository.UpdateBookAsync(request.ConvertToBook());
                }
                else
                {
                    await _bookRepository.AddBookAsync(request.ConvertToBook());
                }

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}