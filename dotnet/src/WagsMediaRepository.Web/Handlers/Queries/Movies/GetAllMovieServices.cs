namespace WagsMediaRepository.Web.Handlers.Queries.Movies;

public class GetAllMovieServices
{
    public class Request : IRequest<OperationResultValue<List<MovieServiceApiModel>>> { }

    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResultValue<List<MovieServiceApiModel>>>
    {
        public async Task<OperationResultValue<List<MovieServiceApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var services = await movieRepository.GetServicesAsync();

                return new OperationResultValue<List<MovieServiceApiModel>>(services.Select(MovieServiceApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<List<MovieServiceApiModel>>(e.Message);
            }
        }
    }
}