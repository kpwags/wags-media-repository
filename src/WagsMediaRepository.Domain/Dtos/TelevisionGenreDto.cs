namespace WagsMediaRepository.Domain.Dtos;

public class TelevisionGenreDto
{
    public int TelevisionGenreId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<TelevisionShowToTelevisionGenreDto> TelevisionShowToTelevisionGenres { get; set; } = [];
}