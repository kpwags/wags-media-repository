namespace WagsMediaRepository.Domain.Dtos;

public class TelevisionShowDto
{
    public int TelevisionShowId { get; set; }
    
    public int TelevisionStatusId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string ImdbLink { get; set; } = string.Empty;
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int CurrentSeason { get; set; }

    public TelevisionStatusDto TelevisionStatus { get; set; } = new();

    public List<TelevisionShowToTelevisionGenreDto> TelevisionToTelevisionGenres { get; set; } = [];
    
    public List<TelevisionShowToTelevisionServiceDto> TelevisionToTelevisionServices { get; set; } = [];
}