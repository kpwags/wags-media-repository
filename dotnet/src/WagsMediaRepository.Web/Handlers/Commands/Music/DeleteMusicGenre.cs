namespace WagsMediaRepository.Web.Handlers.Commands.Music;

public class DeleteMusicGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int MusicGenreId { get; init; }
        
        public Request() { }

        public Request(int id)
        {
            MusicGenreId = id;
        }
    }

    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;

        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await _musicRepository.DeleteGenreAsync(request.MusicGenreId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}