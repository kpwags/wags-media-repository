namespace WagsMediaRepository.Application.Repositories;

public interface IPodcastRepository
{
    Task<PodcastCategory?> GetCategoryByIdAsync(int podcastCategoryId);

    Task<List<PodcastCategory>> GetCategoriesAsync();

    Task<PodcastCategory> AddPodcastCategoryAsync(PodcastCategory category);
    
    Task<PodcastCategory> UpdatePodcastCategoryAsync(PodcastCategory category);
    
    Task DeletePodcastCategoryAsync(int podcastCategoryId);
    
    Task<Podcast?> GetPodcastByIdAsync(int podcastId);

    Task<List<Podcast>> GetPodcastsAsync();

    Task<Podcast> AddPodcastAsync(Podcast podcast);
    
    Task<Podcast> UpdatePodcastAsync(Podcast podcast);
    
    Task DeletePodcastAsync(int podcastId);
}