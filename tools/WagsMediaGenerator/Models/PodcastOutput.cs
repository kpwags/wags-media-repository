namespace WagsMediaGenerator.Models;

public class PodcastOutput
{
    public string Name { get; set; } = string.Empty;

    public List<Podcast> Podcasts { get; set; } = [];
}