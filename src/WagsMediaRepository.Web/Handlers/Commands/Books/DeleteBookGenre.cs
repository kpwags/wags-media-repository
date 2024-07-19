namespace WagsMediaRepository.Web.Handlers.Commands.Books;

public class DeleteBookGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int BookGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            BookGenreId = id;
        }
    }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _bookRepository.DeleteGenreAsync(request.BookGenreId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}