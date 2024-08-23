using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Television;

public class SaveTelevisionGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int TelevisionGenreId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(int id, string name, string color)
        {
            TelevisionGenreId = id;
            Name = name;
            ColorCode = color;
        }
    }
    
    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.TelevisionGenreId > 0)
                {
                    await _televisionRepository.UpdateGenreAsync(new TelevisionGenre
                    {
                        TelevisionGenreId = request.TelevisionGenreId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await _televisionRepository.AddGenreAsync(new TelevisionGenre
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