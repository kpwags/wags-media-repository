using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.VideoGames;

public class SaveVideoGameGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int VideoGameGenreId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(string name, string color)
        {
            Name = name;
            ColorCode = color;
        }

        public Request(int id, string name, string color)
        {
            VideoGameGenreId = id;
            Name = name;
            ColorCode = color;
        }
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.VideoGameGenreId > 0)
                {
                    
                    await videoGameRepository.UpdateVideoGameGenreAsync(new VideoGameGenre
                    {
                        VideoGameGenreId = request.VideoGameGenreId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await videoGameRepository.AddVideoGameGenreAsync(new VideoGameGenre
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