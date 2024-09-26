using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;
using WagsMediaRepository.Web.Handlers.Commands.Books;

namespace WagsMediaRepository.Web.Handlers.Commands.Music;

public class SaveMusicGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int MusicGenreId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(int id, string name, string color)
        {
            MusicGenreId = id;
            Name = name;
            ColorCode = color;
        }
    }
    
    public class Handler(IMusicRepository musicRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly IMusicRepository _musicRepository = musicRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.MusicGenreId > 0)
                {
                    await _musicRepository.UpdateGenreAsync(new MusicGenre
                    {
                        MusicGenreId = request.MusicGenreId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await _musicRepository.AddGenreAsync(new MusicGenre
                    {
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
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