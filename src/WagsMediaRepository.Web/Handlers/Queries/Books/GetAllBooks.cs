namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetAllBooks
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<BookApiModel>>> { }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<BookApiModel>>>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResultValue<IReadOnlyCollection<BookApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var books = await _bookRepository.GetBooksAsync();

                return new OperationResultValue<IReadOnlyCollection<BookApiModel>>(books.Select(BookApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<BookApiModel>>(e.Message);
            }
        }
    }
}