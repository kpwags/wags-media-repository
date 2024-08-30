using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Movies;

public class SaveMovie
{
    public class Request : IRequest<OperationResult>
    {
        public int MovieId { get; set; }
        
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "IMDb link is required.")]
        public string ImdbLink { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Status is required.")]
        public Constants.MovieStatus Status { get; set; }
        
        public DateTime? DateWatched { get; set; }
        
        public int? SortOrder { get; set; }
        
        [Range(0, 5, ErrorMessage = "Rating must be between 0 & 5")]
        public int Rating { get; set; }

        public string Thoughts { get; set; } = string.Empty;
    
        public string PosterImageUrl { get; set; } = string.Empty;

        public string[] GenreIds { get; set; } = [];

        public string[] ServiceIds { get; set; } = [];
        
        public Request() { }

        public Request(MovieApiModel movie)
        {
            MovieId = movie.MovieId;
            Title = movie.Title;
            ImdbLink = movie.ImdbLink;
            Status = (Constants.MovieStatus)movie.MovieStatusId;
            DateWatched = movie.DateWatched;
            SortOrder = movie.SortOrder;
            Rating = movie.Rating;
            Thoughts = movie.Thoughts;
            PosterImageUrl = movie.PosterImageUrl;
            GenreIds = movie.Genres.Select(g => g.MovieGenreId.ToString()).ToArray();
            ServiceIds = movie.Services.Select(s => s.MovieServiceId.ToString()).ToArray();
        }

        public Movie ConvertToMovie() => new()
        {
            MovieId = MovieId,
            Title = Title,
            ImdbLink = ImdbLink,
            DateWatched = DateWatched,
            SortOrder = SortOrder,
            MovieStatusId = (int)Status,
            Rating = Rating,
            Thoughts = Thoughts,
            PosterImageUrl = PosterImageUrl,
            Genres = GenreIds.Select(g => int.Parse(g)).Select(g => new MovieGenre { MovieGenreId = g }).ToList(),
            Services = ServiceIds.Select(s => int.Parse(s)).Select(s => new MovieService { MovieServiceId = s }).ToList(),
        };
    }
    
    public class Handler(IMovieRepository movieRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.MovieId > 0)
                {
                    await movieRepository.UpdateMovieAsync(request.ConvertToMovie());
                }
                else
                {
                    await movieRepository.AddMovieAsync(request.ConvertToMovie());
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