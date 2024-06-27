namespace WagsMediaRepository.Domain.Dtos;

public class MovieServiceDto
{
    public int MovieServiceId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<MovieToMovieServiceDto> MovieToMovieService { get; set; } = [];
}