namespace WagsMediaRepository.Web.Handlers.Queries.Podcasts;

public class GetAllPodcastCategories
{
    public class Request : IRequest<OperationResultValue<List<PodcastCategoryApiModel>>> { }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResultValue<List<PodcastCategoryApiModel>>>
    {
        public async Task<OperationResultValue<List<PodcastCategoryApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var podcastCategories = await podcastRepository.GetCategoriesAsync();

                return new OperationResultValue<List<PodcastCategoryApiModel>>(podcastCategories.Select(PodcastCategoryApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<PodcastCategoryApiModel>>(e.Message);
            }
        }
    }
}