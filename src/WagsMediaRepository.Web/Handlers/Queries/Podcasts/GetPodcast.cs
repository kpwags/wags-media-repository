namespace WagsMediaRepository.Web.Handlers.Queries.Podcasts;

public class GetPodcast
{
    public class Request : IRequest<OperationResultValue<PodcastApiModel>>
    {
        public int PodcastId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            PodcastId = id;
        }
    }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResultValue<PodcastApiModel>>
    {
        public async Task<OperationResultValue<PodcastApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var podcast = await podcastRepository.GetPodcastByIdAsync(request.PodcastId);

                if (podcast is null)
                {
                    return new OperationResultValue<PodcastApiModel>("Unable to find podcast");
                }

                return new OperationResultValue<PodcastApiModel>(PodcastApiModel.FromDomainModel(podcast));
            }
            catch (Exception e)
            {
                return new OperationResultValue<PodcastApiModel>(e.Message);
            }
        }
    }
}