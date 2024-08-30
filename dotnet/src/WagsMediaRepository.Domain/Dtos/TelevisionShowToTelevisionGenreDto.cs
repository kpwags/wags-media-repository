namespace WagsMediaRepository.Domain.Dtos;

public class TelevisionShowToTelevisionGenreDto
{
    public int TelevisionShowToTelevisionGenreId { get; set; }
    
    public int TelevisionShowId { get; set; }
    
    public int TelevisionGenreId { get; set; }

    public TelevisionShowDto TelevisionShow { get; set; } = new();
    
    public TelevisionGenreDto TelevisionGenre { get; set; } = new();
}