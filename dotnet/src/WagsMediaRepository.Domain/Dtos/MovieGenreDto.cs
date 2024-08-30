namespace WagsMediaRepository.Domain.Dtos;

public class MovieGenreDto
{
    public int MovieGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<MovieToMovieGenreDto> MovieToMovieGenres { get; set; } = [];
}