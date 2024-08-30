namespace WagsMediaRepository.Web.Handlers.Queries.Television;

public class GetAllTelevisionServices
{
    public class Request : IRequest<OperationResultValue<List<TelevisionServiceApiModel>>> { }

    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResultValue<List<TelevisionServiceApiModel>>>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResultValue<List<TelevisionServiceApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var services = await _televisionRepository.GetServicesAsync();

                return new OperationResultValue<List<TelevisionServiceApiModel>>(services.Select(TelevisionServiceApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<TelevisionServiceApiModel>>(e.Message);
            }
        }
    }
}