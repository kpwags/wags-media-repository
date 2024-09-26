namespace WagsMediaRepository.Web.Handlers.Queries.Music;

public class GetAllMusicGenres
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<MusicGenreApiModel>>> { }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<MusicGenreApiModel>>>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResultValue<IReadOnlyCollection<MusicGenreApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var genres = await _musicRepository.GetGenresAsync();

                return new OperationResultValue<IReadOnlyCollection<MusicGenreApiModel>>(genres.Select(MusicGenreApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<MusicGenreApiModel>>(e.Message);
            }
        }
    }
}