namespace WagsMediaRepository.Web.Handlers.Commands.Movies;

public class DeleteMovieGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int MovieGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MovieGenreId = id;
        }
    }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await movieRepository.DeleteGenreAsync(request.MovieGenreId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}