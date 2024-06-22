namespace WagsMediaRepository.Web.Handlers.Queries.VideoGames;

public class GetAllVideoGameSystems
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<VideoGameSystemApiModel>>> { }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<VideoGameSystemApiModel>>>
    {
        public async Task<OperationResultValue<IReadOnlyCollection<VideoGameSystemApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var videoGameSystems = await videoGameRepository.GetAllVideoGameSystemsAsync();

                return new OperationResultValue<IReadOnlyCollection<VideoGameSystemApiModel>>(videoGameSystems.Select(VideoGameSystemApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<VideoGameSystemApiModel>>(e.Message);
            }
        }
    }
}