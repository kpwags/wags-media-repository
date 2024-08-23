namespace WagsMediaRepository.Domain.Dtos;

public class VideoGameGenreDto
{
    public int VideoGameGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<VideoGameToVideoGameGenreDto> VideoGameToVideoGameGenres { get; set; } = [];
}