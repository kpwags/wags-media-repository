namespace WagsMediaRepository.Web.Handlers.Queries.Music;

public class GetMusicReferenceData
{
    public class Request : IRequest<OperationResultValue<MusicReferenceData>> { }

    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResultValue<MusicReferenceData>>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;

        public async Task<OperationResultValue<MusicReferenceData>> Handle(Request request, CancellationToken cancellationToken)
        {
            var getGenres = _musicRepository.GetGenresAsync();
            var getFormats = _musicRepository.GetFormatsAsync();

            await Task.WhenAll(
                getGenres,
                getFormats
            );

            return new OperationResultValue<MusicReferenceData>(new MusicReferenceData()
            {
                Genres = getGenres.Result.Select(MusicGenreApiModel.FromDomainModel).ToList(),
                Formats = getFormats.Result.Select(MusicFormatApiModel.FromDomainModel).ToList(),
            });
        }
    }
}