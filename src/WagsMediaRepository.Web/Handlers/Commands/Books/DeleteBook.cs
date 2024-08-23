namespace WagsMediaRepository.Web.Handlers.Commands.Books;

public class DeleteBook
{
    public class Request : IRequest<OperationResult>
    {
        public int BookId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            BookId = id;
        }
    }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _bookRepository.DeleteBookAsync(request.BookId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}