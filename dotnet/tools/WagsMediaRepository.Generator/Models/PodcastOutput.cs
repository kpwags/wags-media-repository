using WagsMediaRepository.Generator.DownloadModels;

namespace WagsMediaRepository.Generator.Models;

public class PodcastOutput
{
    public string Name { get; set; } = string.Empty;

    public List<PodcastDownloadModel> Podcasts { get; set; } = [];
}