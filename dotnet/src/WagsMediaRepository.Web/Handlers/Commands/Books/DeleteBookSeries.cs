namespace WagsMediaRepository.Web.Handlers.Commands.Books;

public class DeleteBookSeries
{
    public class Request : IRequest<OperationResult>
    {
        public int BookSeriesId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            BookSeriesId = id;
        }
    }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _bookRepository.DeleteSeriesAsync(request.BookSeriesId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}