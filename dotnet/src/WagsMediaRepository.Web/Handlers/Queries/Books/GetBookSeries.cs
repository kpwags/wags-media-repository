using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetBookSeries
{
    public class Request : IRequest<OperationResultValue<BookSeriesApiModel>>
    {
        public int BookSeriesId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            BookSeriesId = id;
        }
    }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResultValue<BookSeriesApiModel>>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResultValue<BookSeriesApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var series = await _bookRepository.GetSeriesByIdAsync(request.BookSeriesId);

                if (series is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified series");
                }

                return new OperationResultValue<BookSeriesApiModel>(BookSeriesApiModel.FromDomainModel(series));
            }
            catch (Exception e)
            {
                return new OperationResultValue<BookSeriesApiModel>(e.Message);
            }
        }
    }
}