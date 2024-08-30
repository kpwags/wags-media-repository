namespace WagsMediaRepository.Web.Handlers.Commands.Podcasts;

public class DeletePodcast
{
    public class Request : IRequest<OperationResult>
    {
        public int PodcastId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            PodcastId = id;
        }
    }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await podcastRepository.DeletePodcastAsync(request.PodcastId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}