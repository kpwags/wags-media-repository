namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetAllBookSeries
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<BookSeriesApiModel>>> { }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<BookSeriesApiModel>>>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResultValue<IReadOnlyCollection<BookSeriesApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var series = await _bookRepository.GetSeriesAsync();

                return new OperationResultValue<IReadOnlyCollection<BookSeriesApiModel>>(series.Select(BookSeriesApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<BookSeriesApiModel>>(e.Message);
            }
        }
    }
}