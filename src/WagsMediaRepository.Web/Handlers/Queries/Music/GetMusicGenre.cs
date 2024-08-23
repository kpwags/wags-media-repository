using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Music;

public class GetMusicGenre
{
    public class Request : IRequest<OperationResultValue<MusicGenreApiModel>>
    {
        public int MusicGenreId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MusicGenreId = id;
        }
    }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResultValue<MusicGenreApiModel>>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResultValue<MusicGenreApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genre = await _musicRepository.GetGenreByIdAsync(request.MusicGenreId);

                if (genre is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified genre");
                }

                return new OperationResultValue<MusicGenreApiModel>(MusicGenreApiModel.FromDomainModel(genre));
            }
            catch (Exception e)
            {
                return new OperationResultValue<MusicGenreApiModel>(e.Message);
            }
        }
    }
}