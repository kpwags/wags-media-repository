namespace WagsMediaRepository.Web.Handlers.Commands.Television;

public class DeleteTelevisionShow
{
    public class Request : IRequest<OperationResult>
    {
        public int TelevisionShowId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            TelevisionShowId = id;
        }
    }

    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _televisionRepository.DeleteTelevisionShowAsync(request.TelevisionShowId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}