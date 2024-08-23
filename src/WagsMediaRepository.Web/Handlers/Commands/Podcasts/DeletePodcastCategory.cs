namespace WagsMediaRepository.Web.Handlers.Commands.Podcasts;

public class DeletePodcastCategory
{
    public class Request : IRequest<OperationResult>
    {
        public int PodcastCategoryId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            PodcastCategoryId = id;
        }
    }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await podcastRepository.DeletePodcastCategoryAsync(request.PodcastCategoryId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}