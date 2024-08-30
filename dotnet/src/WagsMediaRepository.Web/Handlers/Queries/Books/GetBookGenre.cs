using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetBookGenre
{
    public class Request : IRequest<OperationResultValue<BookGenreApiModel>>
    {
        public int BookGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            BookGenreId = id;
        }
    }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResultValue<BookGenreApiModel>>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResultValue<BookGenreApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genre = await _bookRepository.GetGenreByIdAsync(request.BookGenreId);

                if (genre is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified genre");
                }

                return new OperationResultValue<BookGenreApiModel>(BookGenreApiModel.FromDomainModel(genre));
            }
            catch (Exception e)
            {
                return new OperationResultValue<BookGenreApiModel>(e.Message);
            }
        }
    }
}