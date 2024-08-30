using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Movies;

public class SaveMovieService
{
    public class Request : IRequest<OperationResult>
    {
        public int MovieServiceId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(int id, string name, string color)
        {
            MovieServiceId = id;
            Name = name;
            ColorCode = color;
        }
    }
    
    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.MovieServiceId > 0)
                {
                    await movieRepository.UpdateServiceAsync(new MovieService
                    {
                        MovieServiceId = request.MovieServiceId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await movieRepository.AddServiceAsync(new MovieService
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