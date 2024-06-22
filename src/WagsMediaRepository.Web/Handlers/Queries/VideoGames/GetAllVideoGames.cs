namespace WagsMediaRepository.Web.Handlers.Queries.VideoGames;

public class GetAllVideoGames
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<VideoGameApiModel>>> { }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<VideoGameApiModel>>>
    {
        public async Task<OperationResultValue<IReadOnlyCollection<VideoGameApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var videoGames = await videoGameRepository.GetAllVideoGamesAsync();

                return new OperationResultValue<IReadOnlyCollection<VideoGameApiModel>>(videoGames.Select(VideoGameApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<VideoGameApiModel>>(e.Message);
            }
        }
    }
}