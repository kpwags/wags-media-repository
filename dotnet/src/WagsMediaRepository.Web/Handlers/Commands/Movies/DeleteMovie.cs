namespace WagsMediaRepository.Web.Handlers.Commands.Movies;

public class DeleteMovie
{
    public class Request : IRequest<OperationResult>
    {
        public int MovieId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MovieId = id;
        }
    }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await movieRepository.DeleteMovieAsync(request.MovieId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}