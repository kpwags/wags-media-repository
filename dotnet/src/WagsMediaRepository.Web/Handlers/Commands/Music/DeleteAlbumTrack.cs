namespace WagsMediaRepository.Web.Handlers.Commands.Music;

public class DeleteAlbumTrack
{
    public class Request : IRequest<OperationResult>
    {
        public int AlbumTrackId { get; init; }
        
        public Request() { }

        public Request(int id)
        {
            AlbumTrackId = id;
        }
    }

    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;

        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _musicRepository.DeleteTrackAsync(request.AlbumTrackId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}