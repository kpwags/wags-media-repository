namespace WagsMediaRepository.Domain.Models;

public class Movie
{
    public int MovieId { get; set; }
    
    public int MovieStatusId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ImdbLink { get; set; } = string.Empty;
    
    public DateTime? DateWatched { get; set; }
    
    public int? SortOrder { get; set; }
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string PosterImageUrl { get; set; } = string.Empty;

    public MovieStatus Status { get; set; } = new();

    public List<MovieGenre> Genres { get; set; } = [];

    public List<MovieService> Services { get; set; } = [];

    public static Movie FromDto(MovieDto dto) => new()
    {
        MovieId = dto.MovieId,
        MovieStatusId = dto.MovieStatusId,
        Title = dto.Title,
        ImdbLink = dto.ImdbLink,
        DateWatched = dto.DateWatched,
        SortOrder = dto.SortOrder,
        Rating = dto.Rating,
        Thoughts = dto.Thoughts,
        PosterImageUrl = dto.PosterImageUrl,
        Status = MovieStatus.FromDto(dto.MovieStatus),
        Genres = dto.MovieToMovieGenres
            .Select(mg => MovieGenre.FromDto(mg.MovieGenre))
            .ToList(),
        Services = dto.MovieToMovieServices
            .Select(ms => MovieService.FromDto(ms.MovieService))
            .ToList(),
    };
}