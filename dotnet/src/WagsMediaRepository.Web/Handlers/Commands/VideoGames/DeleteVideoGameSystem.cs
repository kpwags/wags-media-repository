namespace WagsMediaRepository.Web.Handlers.Commands.VideoGames;

public class DeleteVideoGameSystem
{
    public class Request : IRequest<OperationResult>
    {
        public int VideoGameSystemId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            VideoGameSystemId = id;
        }
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await videoGameRepository.DeleteVideoGameSystemAsync(request.VideoGameSystemId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}