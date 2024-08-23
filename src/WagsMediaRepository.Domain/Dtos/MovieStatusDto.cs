namespace WagsMediaRepository.Domain.Dtos;

public class MovieStatusDto
{
    public int MovieStatusId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<MovieDto> Movies { get; set; } = [];
}