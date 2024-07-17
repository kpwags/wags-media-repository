namespace WagsMediaRepository.Web.Handlers.Commands.Television;

public class DeleteTelevisionGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int TelevisionGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            TelevisionGenreId = id;
        }
    }

    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _televisionRepository.DeleteGenreAsync(request.TelevisionGenreId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}