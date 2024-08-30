using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Books;

public class SaveBookSeries
{
    public class Request : IRequest<OperationResult>
    {
        public int BookSeriesId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(int id, string name, string color)
        {
            BookSeriesId = id;
            Name = name;
            ColorCode = color;
        }
    }
    
    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.BookSeriesId > 0)
                {
                    await _bookRepository.UpdateSeriesAsync(new BookSeries
                    {
                        BookSeriesId = request.BookSeriesId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await _bookRepository.AddSeriesAsync(new BookSeries
                    {
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
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