namespace WagsMediaRepository.Domain.Dtos;

public class MovieDto
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

    public MovieStatusDto MovieStatus { get; set; } = new();
    
    public List<MovieToMovieGenreDto> MovieToMovieGenres { get; set; } = [];
    
    public List<MovieToMovieServiceDto> MovieToMovieServices { get; set; } = [];
}