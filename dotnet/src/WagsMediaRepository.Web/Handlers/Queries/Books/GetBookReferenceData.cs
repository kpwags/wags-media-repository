namespace WagsMediaRepository.Web.Handlers.Queries.Books;

public class GetBookReferenceData
{
    public class Request : IRequest<OperationResultValue<BookReferenceData>> { }

    public class Handler(IBookRepository bookRepository) : IRequestHandler<Request, OperationResultValue<BookReferenceData>>
    {
        private readonly IBookRepository _bookRepository = bookRepository;
        
        public async Task<OperationResultValue<BookReferenceData>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                
                var getGenres = _bookRepository.GetGenresAsync();
                var getFormats = _bookRepository.GetFormatsAsync();
                var getTypes = _bookRepository.GetTypesAsync();
                var getSeries = _bookRepository.GetSeriesAsync();
                var getStatuses = _bookRepository.GetStatusesAsync();

                await Task.WhenAll(
                    getGenres,
                    getFormats,
                    getTypes,
                    getSeries,
                    getStatuses
                );

                return new OperationResultValue<BookReferenceData>(new BookReferenceData()
                {
                    Genres = getGenres.Result.Select(BookGenreApiModel.FromDomainModel).ToList(),
                    Formats = getFormats.Result.Select(BookFormatApiModel.FromDomainModel).ToList(),
                    Types = getTypes.Result.Select(BookTypeApiModel.FromDomainModel).ToList(),
                    Series = getSeries.Result.Select(BookSeriesApiModel.FromDomainModel).ToList(),
                    Statuses = getStatuses.Result.Select(BookStatusApiModel.FromDomainModel).ToList(),
                });
            }
            catch (Exception e)
            {
                return new OperationResultValue<BookReferenceData>(e.Message);
            }
        }
    }
}