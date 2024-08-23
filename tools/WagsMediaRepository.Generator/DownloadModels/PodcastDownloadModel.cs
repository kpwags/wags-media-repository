using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.Models;

namespace WagsMediaRepository.Generator.DownloadModels;

public class PodcastDownloadModel
{
    public int PodcastId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;

    public Tag Category { get; set; } = new();

    public static PodcastDownloadModel FromApiModel(PodcastApiModel podcast) => new()
    {
        PodcastId = podcast.PodcastId,
        Name = podcast.Name,
        Link = podcast.Link,
        CoverImageUrl = podcast.CoverImageUrl,
        Category = new Tag(podcast.Category.Name, podcast.Category.ColorCode)
    };
}