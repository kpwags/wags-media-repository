namespace WagsMediaRepository.Domain.ApiModels;

public class TelevisionShowApiModel
{
    public int TelevisionShowId { get; set; }
    
    public int TelevisionStatusId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string ImdbLink { get; set; } = string.Empty;
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int CurrentSeason { get; set; }
    
    public int NumberOfSeasons { get; set; }
    
    public int? SortOrder { get; set; }

    public TelevisionStatusApiModel Status { get; set; } = new();

    public IReadOnlyCollection<TelevisionGenreApiModel> Genres { get; set; } = [];

    public IReadOnlyCollection<TelevisionServiceApiModel> Services { get; set; } = [];

    public static TelevisionShowApiModel FromDomainModel(TelevisionShow domainModel) => new()
    {
        TelevisionShowId = domainModel.TelevisionShowId,
        TelevisionStatusId = domainModel.TelevisionStatusId,
        Title = domainModel.Title,
        ImdbLink = domainModel.ImdbLink,
        Rating = domainModel.Rating,
        Thoughts = domainModel.Thoughts,
        CoverImageUrl = domainModel.CoverImageUrl,
        CurrentSeason = domainModel.CurrentSeason,
        NumberOfSeasons = domainModel.NumberOfSeasons,
        SortOrder = domainModel.SortOrder,
        Status = TelevisionStatusApiModel.FromDomainModel(domainModel.Status),
        Genres = domainModel.Genres.Select(TelevisionGenreApiModel.FromDomainModel).ToList(),
        Services = domainModel.Services.Select(TelevisionServiceApiModel.FromDomainModel).ToList(),
    };
}