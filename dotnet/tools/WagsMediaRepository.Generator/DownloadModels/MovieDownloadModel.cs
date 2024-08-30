using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.Models;

namespace WagsMediaRepository.Generator.DownloadModels;

public class MovieDownloadModel
{
    public int MovieId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ImdbLink { get; set; } = string.Empty;
    
    public DateTime? DateWatched { get; set; }
    
    public int? SortOrder { get; set; }
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string PosterImageUrl { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];

    public IReadOnlyCollection<Tag> Services { get; set; } = [];

    public static MovieDownloadModel FromApiModel(MovieApiModel movie) => new()
    {
        MovieId = movie.MovieId,
        Title = movie.Title,
        ImdbLink = movie.ImdbLink,
        DateWatched = movie.DateWatched,
        SortOrder = movie.SortOrder,
        Rating = movie.Rating,
        Thoughts = movie.Thoughts,
        PosterImageUrl = movie.PosterImageUrl,
        Status = movie.Status.Name,
        Genres = movie.Genres.Select(g => new Tag(g.Name, g.ColorCode)).ToList(),
        Services = movie.Services.Select(s => new Tag(s.Name, s.ColorCode)).ToList(),
    };
}