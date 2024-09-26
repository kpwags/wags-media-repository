namespace WagsMediaRepository.Domain.ApiModels;

public class VideoGameApiModel
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

    public List<VideoGameGenreApiModel> Genres { get; set; } = [];
    
    public List<VideoGameSystemApiModel> Systems { get; set; } = [];

    public static VideoGameApiModel FromDomainModel(VideoGame domainModel) => new()
    {
        VideoGameId = domainModel.VideoGameId,
        Title = domainModel.Title,
        Link = domainModel.Link,
        DateStarted = domainModel.DateStarted,
        DateCompleted = domainModel.DateCompleted,
        Rating = domainModel.Rating,
        Thoughts = domainModel.Thoughts,
        CoverImageUrl = domainModel.CoverImageUrl,
        SortOrder = domainModel.SortOrder,
        Status = domainModel.Status,
        CompletionStatus = domainModel.CompletionStatus,
        Genres = domainModel.Genres.Select(VideoGameGenreApiModel.FromDomainModel).ToList(),
        Systems = domainModel.Systems.Select(VideoGameSystemApiModel.FromDomainModel).ToList(),
    };
}