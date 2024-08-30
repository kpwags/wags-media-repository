using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.VideoGames;

public class SaveVideoGameSystem
{
    public class Request : IRequest<OperationResult>
    {
        public int VideoGameSystemId { get; set; }
        
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
            VideoGameSystemId = id;
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
                if (request.VideoGameSystemId > 0)
                {
                    
                    await videoGameRepository.UpdateVideoGameSystemAsync(new VideoGameSystem
                    {
                        VideoGameSystemId = request.VideoGameSystemId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await videoGameRepository.AddVideoGameSystemAsync(new VideoGameSystem
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