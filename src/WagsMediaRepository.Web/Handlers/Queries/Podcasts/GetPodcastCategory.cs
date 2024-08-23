namespace WagsMediaRepository.Web.Handlers.Queries.Podcasts;

public class GetPodcastCategory
{
    public class Request : IRequest<OperationResultValue<PodcastCategoryApiModel>>
    {
        public int PodcastCategoryId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            PodcastCategoryId = id;
        }
    }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResultValue<PodcastCategoryApiModel>>
    {
        public async Task<OperationResultValue<PodcastCategoryApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var podcastCategory = await podcastRepository.GetCategoryByIdAsync(request.PodcastCategoryId);

                if (podcastCategory is null)
                {
                    return new OperationResultValue<PodcastCategoryApiModel>("Unable to find podcast category");
                }

                return new OperationResultValue<PodcastCategoryApiModel>(PodcastCategoryApiModel.FromDomainModel(podcastCategory));
            }
            catch (Exception e)
            {
                return new OperationResultValue<PodcastCategoryApiModel>(e.Message);
            }
        }
    }
}