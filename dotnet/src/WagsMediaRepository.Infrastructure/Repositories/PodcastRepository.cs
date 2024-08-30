using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain.Dtos;
using WagsMediaRepository.Domain.Exceptions;
using WagsMediaRepository.Infrastructure.Database;
using WagsMediaRepository.Infrastructure.Helpers;

namespace WagsMediaRepository.Infrastructure.Repositories;

public class PodcastRepository(IDbContextFactory<ApplicationDbContext> contextFactory) : IPodcastRepository
{
    #region "Podcast Categories"
    public async Task<PodcastCategory?> GetCategoryByIdAsync(int podcastCategoryId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var podcastCategory = await dbContext.PodcastCategories.FindAsync(podcastCategoryId);

        return podcastCategory is not null ? PodcastCategory.FromDto(podcastCategory) : null;
    }

    public async Task<List<PodcastCategory>> GetCategoriesAsync()
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var podcastCategories = await dbContext.PodcastCategories
            .Include(pc => pc.Podcasts)
            .ToListAsync();

        return podcastCategories
            .OrderBy(pc => pc.Name)
            .Select(PodcastCategory.FromDto)
            .ToList();
    }

    public async Task<PodcastCategory> AddPodcastCategoryAsync(PodcastCategory category)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        var newPodcastCategory = new PodcastCategoryDto()
        {
            Name = category.Name,
            ColorCode = category.ColorCode,
        };

        dbContext.PodcastCategories.Add(newPodcastCategory);

        await dbContext.SaveChangesAsync();

        return PodcastCategory.FromDto(newPodcastCategory);
    }

    public async Task<PodcastCategory> UpdatePodcastCategoryAsync(PodcastCategory category)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        var podcastCategory = await dbContext.PodcastCategories.FindAsync(category.PodcastCategoryId);

        if (podcastCategory is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified podcast category");
        }

        podcastCategory.Name = category.Name;
        podcastCategory.ColorCode = category.ColorCode;

        dbContext.PodcastCategories.Update(podcastCategory);

        await dbContext.SaveChangesAsync();
        
        return PodcastCategory.FromDto(podcastCategory);
    }

    public async Task DeletePodcastCategoryAsync(int podcastCategoryId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.PodcastCategories
            .Where(pc => pc.PodcastCategoryId == podcastCategoryId)
            .ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Podcast Categories"

    #region "Podcasts"
    public async Task<Podcast?> GetPodcastByIdAsync(int podcastId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var podcast = await dbContext.Podcasts.FindAsync(podcastId);

        return podcast is not null ? Podcast.FromDto(podcast) : null;
    }

    public async Task<List<Podcast>> GetPodcastsAsync()
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var podcasts = await dbContext.Podcasts
            .Include(p => p.PodcastCategory)
            .ToListAsync();

        return podcasts
            .OrderBy(p => Sorters.SortByTitle(p.Name))
            .Select(Podcast.FromDto)
            .ToList();
    }

    public async Task<Podcast> AddPodcastAsync(Podcast podcast)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var podcastCategory = await dbContext.PodcastCategories.FindAsync(podcast.PodcastCategoryId);
        
        if (podcastCategory is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified podcast category");
        }

        var newPodcast = new PodcastDto
        {
            Name = podcast.Name,
            Link = podcast.Link,
            CoverImageUrl = podcast.CoverImageUrl,
            PodcastCategory = podcastCategory,
        };
        
        dbContext.Podcasts.Add(newPodcast);

        await dbContext.SaveChangesAsync();

        return Podcast.FromDto(newPodcast);
    }

    public async Task<Podcast> UpdatePodcastAsync(Podcast podcast)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var updatedPodcast = await dbContext.Podcasts.FindAsync(podcast.PodcastId);

        if (updatedPodcast is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified podcast");
        }
        
        var podcastCategory = await dbContext.PodcastCategories.FindAsync(podcast.PodcastCategoryId);
        
        if (podcastCategory is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified podcast category");
        }

        updatedPodcast.Name = podcast.Name;
        updatedPodcast.Link = podcast.Link;
        updatedPodcast.CoverImageUrl = podcast.CoverImageUrl;
        updatedPodcast.PodcastCategory = podcastCategory;
        
        dbContext.Podcasts.Update(updatedPodcast);

        await dbContext.SaveChangesAsync();

        return Podcast.FromDto(updatedPodcast);
    }

    public async Task DeletePodcastAsync(int podcastId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.Podcasts
            .Where(p => p.PodcastId == podcastId)
            .ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Podcasts"
}