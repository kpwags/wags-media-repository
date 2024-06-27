namespace WagsMediaRepository.Domain.Dtos;

public class MovieToMovieServiceDto
{
    public int MovieToMovieServicId { get; set; }
    
    public int MovieId { get; set; }
    
    public int MovieServiceId { get; set; }

    public MovieDto Movie { get; set; } = new();
    
    public MovieServiceDto MovieService { get; set; } = new();
}