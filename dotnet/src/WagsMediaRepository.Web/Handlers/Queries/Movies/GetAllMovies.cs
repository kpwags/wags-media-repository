namespace WagsMediaRepository.Web.Handlers.Queries.Movies;

public class GetAllMovies
{
    public class Request : IRequest<OperationResultValue<List<MovieApiModel>>> { }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResultValue<List<MovieApiModel>>>
    {
        public async Task<OperationResultValue<List<MovieApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genres = await movieRepository.GetMoviesAsync();

                return new OperationResultValue<List<MovieApiModel>>(genres.Select(MovieApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<MovieApiModel>>(e.Message);
            }
        }
    }
}