using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Movies;

public class SaveMovieGenre
{
    public class Request : IRequest<OperationResult>
    {
        public int MovieGenreId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(int id, string name, string color)
        {
            MovieGenreId = id;
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
                if (request.MovieGenreId > 0)
                {
                    await movieRepository.UpdateGenreAsync(new MovieGenre
                    {
                        MovieGenreId = request.MovieGenreId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await movieRepository.AddGenreAsync(new MovieGenre
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