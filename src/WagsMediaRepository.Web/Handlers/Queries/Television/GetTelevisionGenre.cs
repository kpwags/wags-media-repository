using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Television;

public class GetTelevisionGenre
{
    public class Request : IRequest<OperationResultValue<TelevisionGenreApiModel>>
    {
        public int TelevisionGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            TelevisionGenreId = id;
        }
    }
    
    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResultValue<TelevisionGenreApiModel>>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResultValue<TelevisionGenreApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genre = await _televisionRepository.GetGenreByIdAsync(request.TelevisionGenreId);

                if (genre is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified genre");
                }

                return new OperationResultValue<TelevisionGenreApiModel>(TelevisionGenreApiModel.FromDomainModel(genre));
            }
            catch (Exception e)
            {
                return new OperationResultValue<TelevisionGenreApiModel>(e.Message);
            }
        }
    }
}