using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetBook
{
    public class Request : IRequest<OperationResultValue<BookApiModel>>
    {
        public int BookId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            BookId = id;
        }
    }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResultValue<BookApiModel>>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResultValue<BookApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var book = await _bookRepository.GetBookByIdAsync(request.BookId);

                if (book is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified book");
                }

                return new OperationResultValue<BookApiModel>(BookApiModel.FromDomainModel(book));
            }
            catch (Exception e)
            {
                return new OperationResultValue<BookApiModel>(e.Message);
            }
        }
    }
}