namespace WagsMediaRepository.Domain.Dtos;

public class MovieToMovieGenreDto
{
    public int MovieToMovieGenreId { get; set; }
    
    public int MovieId { get; set; }
    
    public int MovieGenreId { get; set; }

    public MovieDto Movie { get; set; } = new();
    
    public MovieGenreDto MovieGenre { get; set; } = new();
}