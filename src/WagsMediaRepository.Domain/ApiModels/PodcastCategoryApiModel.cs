namespace WagsMediaRepository.Domain.ApiModels;

public class PodcastCategoryApiModel
{
    public int PodcastCategoryId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static PodcastCategoryApiModel FromDomainModel(PodcastCategory domainModel) => new()
    {
        PodcastCategoryId = domainModel.PodcastCategoryId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}