namespace WagsMediaRepository.Web.Handlers.Queries.Television;

public class GetAllTelevisionShows
{
    public class Request : IRequest<OperationResultValue<List<TelevisionShowApiModel>>> { }

    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResultValue<List<TelevisionShowApiModel>>>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResultValue<List<TelevisionShowApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var shows = await _televisionRepository.GetTelevisionShowsAsync();

                return new OperationResultValue<List<TelevisionShowApiModel>>(shows.Select(TelevisionShowApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<TelevisionShowApiModel>>(e.Message);
            }
        }
    }
}