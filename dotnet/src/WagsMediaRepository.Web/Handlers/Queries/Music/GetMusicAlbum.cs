using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Music;

public class GetMusicAlbum
{
    public class Request : IRequest<OperationResultValue<MusicAlbumApiModel>>
    {
        public int MusicAlbumId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MusicAlbumId = id;
        }
    }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResultValue<MusicAlbumApiModel>>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResultValue<MusicAlbumApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var album = await _musicRepository.GetAlbumByIdAsync(request.MusicAlbumId);

                if (album is null)
                {
                    throw new ObjectNotFoundException("Unable to find specified album");
                }

                return new OperationResultValue<MusicAlbumApiModel>(MusicAlbumApiModel.FromDomainModel(album));
            }
            catch (Exception e)
            {
                return new OperationResultValue<MusicAlbumApiModel>(e.Message);
            }
        }
    }
}