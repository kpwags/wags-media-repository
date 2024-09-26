namespace WagsMediaRepository.Domain.ApiModels;

public class MovieApiModel
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

    public MovieStatusApiModel Status { get; set; } = new();

    public List<MovieGenreApiModel> Genres { get; set; } = [];

    public List<MovieServiceApiModel> Services { get; set; } = [];

    public static MovieApiModel FromDomainModel(Movie domainModel) => new()
    {
        MovieId = domainModel.MovieId,
        MovieStatusId = domainModel.MovieStatusId,
        Title = domainModel.Title,
        ImdbLink = domainModel.ImdbLink,
        DateWatched = domainModel.DateWatched,
        SortOrder = domainModel.SortOrder,
        Rating = domainModel.Rating,
        Thoughts = domainModel.Thoughts,
        PosterImageUrl = domainModel.PosterImageUrl,
        Status = MovieStatusApiModel.FromDomainModel(domainModel.Status),
        Genres = domainModel.Genres.Select(MovieGenreApiModel.FromDomainModel).ToList(),
        Services = domainModel.Services.Select(MovieServiceApiModel.FromDomainModel).ToList(),
    };
}