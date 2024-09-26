using System.Linq;

namespace WagsMediaRepository.Domain.Models;

public class VideoGame
{
    public int VideoGameId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public DateTime? DateStarted { get; set; }
    
    public DateTime? DateCompleted { get; set; }
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int? SortOrder { get; set; }

    public Constants.VideoGameStatus Status { get; set; } = Constants.VideoGameStatus.ToPlay;

    public Constants.VideoGameCompletionStatus CompletionStatus { get; set; } = Constants.VideoGameCompletionStatus.NotApplicable;

    public List<VideoGameGenre> Genres { get; set; } = [];
    
    public List<VideoGameSystem> Systems { get; set; } = [];

    public static VideoGame FromDto(VideoGameDto dto) => new()
    {
        VideoGameId = dto.VideoGameId,
        Title = dto.Title,
        Link = dto.Link,
        DateStarted = dto.DateStarted,
        DateCompleted = dto.DateCompleted,
        Rating = dto.Rating,
        Thoughts = dto.Thoughts,
        CoverImageUrl = dto.CoverImageUrl,
        SortOrder = dto.SortOrder,
        Status = (Constants.VideoGameStatus)dto.VideoGameStatusId,
        CompletionStatus = (Constants.VideoGameCompletionStatus)dto.VideoGameCompletionId,
        Genres = dto.VideoGameToVideoGameGenres
            .Select(vg => vg.VideoGameGenre)
            .Select(VideoGameGenre.FromDto)
            .ToList(),
        Systems = dto.VideoGameToVideoGameSystems
            .Select(vs => vs.VideoGameSystem)
            .Select(VideoGameSystem.FromDto)
            .ToList(),
    };
}