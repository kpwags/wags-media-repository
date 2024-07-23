namespace WagsMediaRepository.Web.Handlers.Commands.Music;

public class DeleteAlbum
{
    public class Request : IRequest<OperationResult>
    {
        public int MusicAlbumId { get; init; }
        
        public Request() { }

        public Request(int id)
        {
            MusicAlbumId = id;
        }
    }

    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;

        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _musicRepository.DeleteAlbumAsync(request.MusicAlbumId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}