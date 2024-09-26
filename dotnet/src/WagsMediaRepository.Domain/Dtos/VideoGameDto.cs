namespace WagsMediaRepository.Domain.Dtos;

public class VideoGameDto
{
    public int VideoGameId { get; set; }
    
    public int VideoGameStatusId { get; set; }
    
    public int VideoGameCompletionId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public DateTime? DateStarted { get; set; }
    
    public DateTime? DateCompleted { get; set; }
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int? SortOrder { get; set; }

    public VideoGameStatusDto VideoGameStatus { get; set; } = new();
    
    public VideoGameCompletionDto VideoGameCompletion { get; set; } = new();

    public List<VideoGameToVideoGameGenreDto> VideoGameToVideoGameGenres { get; set; } = [];
    
    public List<VideoGameToVideoGameSystemDto> VideoGameToVideoGameSystems { get; set; } = [];
}