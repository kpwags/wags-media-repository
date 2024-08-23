namespace WagsMediaRepository.Domain.Dtos;

public class VideoGameSystemDto
{
    public int VideoGameSystemId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<VideoGameToVideoGameSystemDto> VideoGameToVideoGameSystems { get; set; } = [];
}