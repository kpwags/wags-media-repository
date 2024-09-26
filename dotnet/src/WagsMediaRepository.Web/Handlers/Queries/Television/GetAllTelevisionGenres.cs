namespace WagsMediaRepository.Web.Handlers.Queries.Television;

public class GetAllTelevisionGenres
{
    public class Request : IRequest<OperationResultValue<List<TelevisionGenreApiModel>>> { }

    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResultValue<List<TelevisionGenreApiModel>>>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResultValue<List<TelevisionGenreApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genres = await _televisionRepository.GetGenresAsync();

                return new OperationResultValue<List<TelevisionGenreApiModel>>(genres.Select(TelevisionGenreApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<TelevisionGenreApiModel>>(e.Message);
            }
        }
    }
}