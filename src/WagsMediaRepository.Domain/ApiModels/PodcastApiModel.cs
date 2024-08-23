namespace WagsMediaRepository.Domain.ApiModels;

public class PodcastApiModel
{
    public int PodcastId { get; set; }
    
    public int PodcastCategoryId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;

    public PodcastCategoryApiModel Category { get; set; } = new();

    public static PodcastApiModel FromDomainModel(Podcast domainModel) => new()
    {
        PodcastId = domainModel.PodcastId,
        PodcastCategoryId = domainModel.PodcastCategoryId,
        Name = domainModel.Name,
        Link = domainModel.Link,
        CoverImageUrl = domainModel.CoverImageUrl,
        Category = PodcastCategoryApiModel.FromDomainModel(domainModel.Category),
    };
}