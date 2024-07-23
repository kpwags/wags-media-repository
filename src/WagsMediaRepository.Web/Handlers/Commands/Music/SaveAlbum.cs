using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Music;

public class SaveAlbum
{
    public class Request : IRequest<OperationResult>
    {
        public int MusicAlbumId { get; set; }
    
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;
    
        [Required(ErrorMessage = "Artist is required.")]
        public string Artist { get; set; } = string.Empty;

        public string Thoughts { get; set; } = string.Empty;

        [Required(ErrorMessage = "Album Art is required.")]
        public string CoverImageUrl { get; set; } = string.Empty;
    
        public bool IsTopTen { get; set; }
    
        public bool ShowOnNowPage { get; set; }
        
        public IList<int> GenreIds { get; set; } = [];

        public IList<int> FormatIds { get; set; } = [];
        
        public Request() { }

        public Request(MusicAlbumApiModel album)
        {
            MusicAlbumId = album.MusicAlbumId;
            Title = album.Title;
            Artist = album.Artist;
            Thoughts = album.Thoughts;
            CoverImageUrl = album.CoverImageUrl;
            IsTopTen = album.IsTopTen;
            ShowOnNowPage = album.ShowOnNowPage;
            GenreIds = album.Genres.Select(g => g.MusicGenreId).ToArray();
            FormatIds = album.Formats.Select(f => f.MusicFormatId).ToArray();
        }

        public MusicAlbum ConvertToAlbum() => new()
        {
            MusicAlbumId = MusicAlbumId,
            Title = Title,
            Artist = Artist,
            Thoughts = Thoughts,
            CoverImageUrl = CoverImageUrl,
            IsTopTen = IsTopTen,
            ShowOnNowPage = ShowOnNowPage,
            Genres = GenreIds.Select(g => new MusicGenre { MusicGenreId = g }).ToList(),
            Formats = FormatIds.Select(f => new MusicFormat { MusicFormatId = f }).ToList(),
        };
    }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.MusicAlbumId > 0)
                {
                    await _musicRepository.UpdateAlbumAsync(request.ConvertToAlbum());
                }
                else
                {
                    await _musicRepository.AddAlbumAsync(request.ConvertToAlbum());
                }

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}