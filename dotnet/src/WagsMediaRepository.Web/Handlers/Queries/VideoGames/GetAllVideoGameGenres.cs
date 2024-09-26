namespace WagsMediaRepository.Web.Handlers.Queries.VideoGames;

public class GetAllVideoGameGenres
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<VideoGameGenreApiModel>>> { }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<VideoGameGenreApiModel>>>
    {
        public async Task<OperationResultValue<IReadOnlyCollection<VideoGameGenreApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var videoGameGenres = await videoGameRepository.GetAllVideoGameGenresAsync();

                return new OperationResultValue<IReadOnlyCollection<VideoGameGenreApiModel>>(videoGameGenres.Select(VideoGameGenreApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<VideoGameGenreApiModel>>(e.Message);
            }
        }
    }
}