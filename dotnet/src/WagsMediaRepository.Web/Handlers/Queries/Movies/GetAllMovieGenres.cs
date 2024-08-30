namespace WagsMediaRepository.Web.Handlers.Queries.Movies;

public class GetAllMovieGenres
{
    public class Request : IRequest<OperationResultValue<List<MovieGenreApiModel>>> { }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResultValue<List<MovieGenreApiModel>>>
    {
        public async Task<OperationResultValue<List<MovieGenreApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genres = await movieRepository.GetGenresAsync();

                return new OperationResultValue<List<MovieGenreApiModel>>(genres.Select(MovieGenreApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<MovieGenreApiModel>>(e.Message);
            }
        }
    }
}