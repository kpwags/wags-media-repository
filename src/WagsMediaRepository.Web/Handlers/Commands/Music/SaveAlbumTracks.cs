using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Music;

public class SaveAlbumTracks
{
    public class Request : IRequest<OperationResult>
    {
        public int MusicAlbumId { get; set; }
        public List<MusicAlbumTrackApiModel> Tracks { get; set; } = [];
    }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var existingTracks = request.Tracks
                    .Where(t => t.MusicAlbumTrackId > 0)
                    .Select(t => new MusicAlbumTrack { TrackNumber = t.TrackNumber, Title = t.Title })
                    .ToList();
                var newTracks = request.Tracks
                    .Where(t => t.MusicAlbumTrackId == 0)
                    .Select(t => new MusicAlbumTrack { TrackNumber = t.TrackNumber, Title = t.Title })
                    .ToList();

                await Task.WhenAll(
                    _musicRepository.AddTracksAsync(request.MusicAlbumId, newTracks),
                    _musicRepository.UpdateTracksAsync(request.MusicAlbumId, existingTracks)
                );

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}