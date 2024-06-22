namespace WagsMediaRepository.Web.Handlers.Queries.VideoGames;

public class GetVideoGameSystem
{
    public class Request : IRequest<OperationResultValue<VideoGameSystemApiModel>>
    {
        public int VideoGameSystemId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            VideoGameSystemId = id;
        }
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResultValue<VideoGameSystemApiModel>>
    {
        public async Task<OperationResultValue<VideoGameSystemApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var videoGameSystem = await videoGameRepository.GetVideoGameSystemByIdAsync(request.VideoGameSystemId);

                if (videoGameSystem is null)
                {
                    return new OperationResultValue<VideoGameSystemApiModel>("Unable to find video game system");
                }

                return new OperationResultValue<VideoGameSystemApiModel>(VideoGameSystemApiModel.FromDomainModel(videoGameSystem));
            }
            catch (Exception e)
            {
                return new OperationResultValue<VideoGameSystemApiModel>(e.Message);
            }
        }
    }
}