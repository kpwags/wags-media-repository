namespace WagsMediaRepository.Web.Handlers.Queries.Podcasts;

public class GetAllPodcasts
{
    public class Request : IRequest<OperationResultValue<List<PodcastApiModel>>> { }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResultValue<List<PodcastApiModel>>>
    {
        public async Task<OperationResultValue<List<PodcastApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var podcasts = await podcastRepository.GetPodcastsAsync();

                return new OperationResultValue<List<PodcastApiModel>>(podcasts.Select(PodcastApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<PodcastApiModel>>(e.Message);
            }
        }
    }
}