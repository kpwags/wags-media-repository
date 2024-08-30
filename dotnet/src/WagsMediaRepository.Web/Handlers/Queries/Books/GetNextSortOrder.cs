namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetNextSortOrder
{
    public class Request : IRequest<int> { }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, int>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<int> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                return await _bookRepository.GetNextSortOrder();
            }
            catch
            {
                return 0;
            }
        }
    }
}