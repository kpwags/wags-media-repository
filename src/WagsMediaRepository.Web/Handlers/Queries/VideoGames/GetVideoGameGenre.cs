namespace WagsMediaRepository.Web.Handlers.Queries.VideoGames;

public class GetVideoGameGenre
{
    public class Request : IRequest<OperationResultValue<VideoGameGenreApiModel>>
    {
        public int VideoGameGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            VideoGameGenreId = id;
        }
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResultValue<VideoGameGenreApiModel>>
    {
        public async Task<OperationResultValue<VideoGameGenreApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var videoGameGenre = await videoGameRepository.GetVideoGameGenreByIdAsync(request.VideoGameGenreId);

                if (videoGameGenre is null)
                {
                    return new OperationResultValue<VideoGameGenreApiModel>("Unable to find video game genre");
                }

                return new OperationResultValue<VideoGameGenreApiModel>(VideoGameGenreApiModel.FromDomainModel(videoGameGenre));
            }
            catch (Exception e)
            {
                return new OperationResultValue<VideoGameGenreApiModel>(e.Message);
            }
        }
    }
}