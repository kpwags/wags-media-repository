namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetAllBookGenres
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<BookGenreApiModel>>> { }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<BookGenreApiModel>>>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResultValue<IReadOnlyCollection<BookGenreApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genres = await _bookRepository.GetGenresAsync();

                return new OperationResultValue<IReadOnlyCollection<BookGenreApiModel>>(genres.Select(BookGenreApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<BookGenreApiModel>>(e.Message);
            }
        }
    }
}