using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Television;

public class GetTelevisionShow
{
    public class Request : IRequest<OperationResultValue<TelevisionShowApiModel>>
    {
        public int TelevisionShowId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            TelevisionShowId = id;
        }
    }
    
    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResultValue<TelevisionShowApiModel>>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResultValue<TelevisionShowApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var show = await _televisionRepository.GetTelevisionShowByIdAsync(request.TelevisionShowId);

                if (show is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified TV show");
                }

                return new OperationResultValue<TelevisionShowApiModel>(TelevisionShowApiModel.FromDomainModel(show));
            }
            catch (Exception e)
            {
                return new OperationResultValue<TelevisionShowApiModel>(e.Message);
            }
        }
    }
}