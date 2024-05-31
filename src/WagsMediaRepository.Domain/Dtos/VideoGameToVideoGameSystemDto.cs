namespace WagsMediaRepository.Domain.Dtos;

public class VideoGameToVideoGameSystemDto
{
    public int VideoGameToVideoGameSystemId { get; set; }
    
    public int VideoGameId { get; set; }
    
    public int VideoGameSystemId { get; set; }

    public VideoGameDto VideoGame { get; set; } = new();

    public VideoGameSystemDto VideoGameSystem { get; set; } = new();
}