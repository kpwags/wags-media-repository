namespace WagsMediaRepository.Web.Handlers.Queries.Movies;

public class GetMovieGenre
{
    public class Request : IRequest<OperationResultValue<MovieGenreApiModel>>
    {
        public int MovieGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MovieGenreId = id;
        }
    }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResultValue<MovieGenreApiModel>>
    {
        public async Task<OperationResultValue<MovieGenreApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genre = await movieRepository.GetGenreByIdAsync(request.MovieGenreId);

                if (genre is null)
                {
                    return new OperationResultValue<MovieGenreApiModel>("Unable to find movie genre");
                }

                return new OperationResultValue<MovieGenreApiModel>(MovieGenreApiModel.FromDomainModel(genre));
            }
            catch (Exception e)
            {
                return new OperationResultValue<MovieGenreApiModel>(e.Message);
            }
        }
    }
}