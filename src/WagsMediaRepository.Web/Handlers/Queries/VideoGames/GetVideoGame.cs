namespace WagsMediaRepository.Web.Handlers.Queries.VideoGames;

public class GetVideoGame
{
    public class Request : IRequest<OperationResultValue<VideoGameApiModel>>
    {
        public int VideoGameId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            VideoGameId = id;
        }
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResultValue<VideoGameApiModel>>
    {
        public async Task<OperationResultValue<VideoGameApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var videoGame = await videoGameRepository.GetVideoGameByIdAsync(request.VideoGameId);

                if (videoGame is null)
                {
                    return new OperationResultValue<VideoGameApiModel>("Unable to find video game");
                }

                return new OperationResultValue<VideoGameApiModel>(VideoGameApiModel.FromDomainModel(videoGame));
            }
            catch (Exception e)
            {
                return new OperationResultValue<VideoGameApiModel>(e.Message);
            }
        }
    }
}