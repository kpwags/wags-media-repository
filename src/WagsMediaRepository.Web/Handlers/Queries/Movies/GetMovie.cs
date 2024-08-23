namespace WagsMediaRepository.Web.Handlers.Queries.Movies;

public class GetMovie
{
    public class Request : IRequest<OperationResultValue<MovieApiModel>>
    {
        public int MovieId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MovieId = id;
        }
    }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResultValue<MovieApiModel>>
    {
        public async Task<OperationResultValue<MovieApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var movie = await movieRepository.GetMovieById(request.MovieId);

                if (movie is null)
                {
                    return new OperationResultValue<MovieApiModel>("Unable to find movie");
                }

                return new OperationResultValue<MovieApiModel>(MovieApiModel.FromDomainModel(movie));
            }
            catch (Exception e)
            {
                return new OperationResultValue<MovieApiModel>(e.Message);
            }
        }
    }
}