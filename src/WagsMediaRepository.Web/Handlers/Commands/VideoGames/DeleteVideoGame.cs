namespace WagsMediaRepository.Web.Handlers.Commands.VideoGames;

public class DeleteVideoGame
{
    public class Request : IRequest<OperationResult>
    {
        public int VideoGameId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            VideoGameId = id;
        }
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await videoGameRepository.DeleteVideoGameAsync(request.VideoGameId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}