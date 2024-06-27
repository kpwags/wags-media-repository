namespace WagsMediaRepository.Web.Handlers.Commands.Movies;

public class DeleteMovieService
{
    public class Request : IRequest<OperationResult>
    {
        public int MovieServiceId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MovieServiceId = id;
        }
    }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await movieRepository.DeleteServiceAsync(request.MovieServiceId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}