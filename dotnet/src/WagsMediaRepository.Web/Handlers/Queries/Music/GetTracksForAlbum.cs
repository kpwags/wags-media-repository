namespace WagsMediaRepository.Web.Handlers.Queries.Music;

public class GetTracksForAlbum
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<MusicAlbumTrackApiModel>>>
    {
        public int MusicAlbumId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            MusicAlbumId = id;
        }
    }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<MusicAlbumTrackApiModel>>>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResultValue<IReadOnlyCollection<MusicAlbumTrackApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var tracks = await _musicRepository.GetTracksForAlbumAsync(request.MusicAlbumId);

                return new OperationResultValue<IReadOnlyCollection<MusicAlbumTrackApiModel>>(tracks.Select(MusicAlbumTrackApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<MusicAlbumTrackApiModel>>(e.Message);
            }
        }
    }
}