namespace WagsMediaRepository.Domain.Dtos;

public class VideoGameCompletionDto
{
    public int VideoGameCompletionId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<VideoGameDto> VideoGames { get; set; } = [];
}