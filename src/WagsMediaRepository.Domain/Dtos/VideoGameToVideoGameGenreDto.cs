namespace WagsMediaRepository.Domain.Dtos;

public class VideoGameToVideoGameGenreDto
{
    public int VideoGameToVideoGameGenreId { get; set; }
    
    public int VideoGameId { get; set; }
    
    public int VideoGameGenreId { get; set; }

    public VideoGameDto VideoGame { get; set; } = new();

    public VideoGameGenreDto VideoGameGenre { get; set; } = new();
}