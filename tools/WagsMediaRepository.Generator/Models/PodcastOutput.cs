using WagsMediaRepository.Domain.ApiModels;

namespace WagsMediaRepository.Generator.Models;

public class PodcastOutput
{
    public string Name { get; set; } = string.Empty;

    public List<PodcastApiModel> Podcasts { get; set; } = [];
}