using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Television;

public class GetTelevisionService
{
    public class Request : IRequest<OperationResultValue<TelevisionServiceApiModel>>
    {
        public int TelevisionServiceId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            TelevisionServiceId = id;
        }
    }
    
    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResultValue<TelevisionServiceApiModel>>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResultValue<TelevisionServiceApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var service = await _televisionRepository.GetServiceByIdAsync(request.TelevisionServiceId);

                if (service is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified service");
                }

                return new OperationResultValue<TelevisionServiceApiModel>(TelevisionServiceApiModel.FromDomainModel(service));
            }
            catch (Exception e)
            {
                return new OperationResultValue<TelevisionServiceApiModel>(e.Message);
            }
        }
    }
}