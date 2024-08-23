namespace WagsMediaRepository.Domain.Dtos;

public class VideoGameStatusDto
{
    public int VideoGameStatusId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<VideoGameDto> VideoGames { get; set; } = [];
}