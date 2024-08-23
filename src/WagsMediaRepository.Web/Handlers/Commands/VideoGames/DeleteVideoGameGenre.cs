namespace WagsMediaRepository.Web.Handlers.Commands.VideoGames;

public class DeleteVideoGameGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int VideoGameGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            VideoGameGenreId = id;
        }
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await videoGameRepository.DeleteVideoGameGenreAsync(request.VideoGameGenreId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}