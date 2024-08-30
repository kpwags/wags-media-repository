namespace WagsMediaRepository.Domain.Models;

public class VideoGameGenre
{
    public int VideoGameGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static VideoGameGenre FromDto(VideoGameGenreDto dto) => new()
    {
        VideoGameGenreId = dto.VideoGameGenreId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}