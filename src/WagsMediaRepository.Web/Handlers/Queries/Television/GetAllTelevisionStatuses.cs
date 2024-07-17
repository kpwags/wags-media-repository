namespace WagsMediaRepository.Web.Handlers.Queries.Television;

public class GetAllTelevisionStatuses
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<TelevisionStatusApiModel>>> { }

    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<TelevisionStatusApiModel>>>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResultValue<IReadOnlyCollection<TelevisionStatusApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var statuses = await _televisionRepository.GetStatusesAsync();

                return new OperationResultValue<IReadOnlyCollection<TelevisionStatusApiModel>>(statuses.Select(TelevisionStatusApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<TelevisionStatusApiModel>>(e.Message);
            }
        }
    }
}