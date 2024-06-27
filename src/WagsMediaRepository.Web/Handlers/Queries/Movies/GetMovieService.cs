namespace WagsMediaRepository.Web.Handlers.Queries.Movies;

public class GetMovieService
{
    public class Request : IRequest<OperationResultValue<MovieServiceApiModel>>
    {
        public int MovieServiceId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MovieServiceId = id;
        }
    }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResultValue<MovieServiceApiModel>>
    {
        public async Task<OperationResultValue<MovieServiceApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var service = await movieRepository.GetServiceByIdAsync(request.MovieServiceId);

                if (service is null)
                {
                    return new OperationResultValue<MovieServiceApiModel>("Unable to find movie service");
                }

                return new OperationResultValue<MovieServiceApiModel>(MovieServiceApiModel.FromDomainModel(service));
            }
            catch (Exception e)
            {
                return new OperationResultValue<MovieServiceApiModel>(e.Message);
            }
        }
    }
}