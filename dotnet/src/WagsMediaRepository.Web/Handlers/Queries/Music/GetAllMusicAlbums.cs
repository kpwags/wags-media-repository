namespace WagsMediaRepository.Web.Handlers.Queries.Music;

public class GetAllMusicAlbums
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<MusicAlbumApiModel>>> { }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<MusicAlbumApiModel>>>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResultValue<IReadOnlyCollection<MusicAlbumApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var albums = await _musicRepository.GetAlbumsAsync();

                return new OperationResultValue<IReadOnlyCollection<MusicAlbumApiModel>>(albums.Select(MusicAlbumApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<MusicAlbumApiModel>>(e.Message);
            }
        }
    }
}