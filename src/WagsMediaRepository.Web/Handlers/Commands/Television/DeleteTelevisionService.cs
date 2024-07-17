namespace WagsMediaRepository.Web.Handlers.Commands.Television;

public class DeleteTelevisionService
{
    public class Request : IRequest<OperationResult>
    {
        public int TelevisionServiceId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            TelevisionServiceId = id;
        }
    }

    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _televisionRepository.DeleteServiceAsync(request.TelevisionServiceId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}