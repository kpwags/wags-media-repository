using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain.Dtos;
using WagsMediaRepository.Domain.Exceptions;
using WagsMediaRepository.Infrastructure.Database;

namespace WagsMediaRepository.Infrastructure.Repositories;

public class VideoGameRepository(IDbContextFactory<ApplicationDbContext> contextFactory) : IVideoGameRepository
{
    #region "Video Games"
    public async Task<VideoGame?> GetVideoGameByIdAsync(int videoGameId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var videoGame = await dbContext.VideoGames
            .Include(v => v.VideoGameToVideoGameGenres)
            .ThenInclude(vg => vg.VideoGameGenre)
            .Include(v => v.VideoGameToVideoGameSystems)
            .ThenInclude(vs => vs.VideoGameSystem)
            .FirstOrDefaultAsync(v => v.VideoGameId == videoGameId);

        return videoGame is not null ? VideoGame.FromDto(videoGame) : null;
    }

    public async Task<List<VideoGame>> GetAllVideoGamesAsync()
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var videoGames = await dbContext.VideoGames
            .Include(v => v.VideoGameToVideoGameGenres)
            .ThenInclude(vg => vg.VideoGameGenre)
            .Include(v => v.VideoGameToVideoGameSystems)
            .ThenInclude(vs => vs.VideoGameSystem)
            .ToListAsync();

        return videoGames.Select(VideoGame.FromDto).ToList();
    }

    public async Task<VideoGame> AddVideoGameAsync(VideoGame videoGame)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var completionStatus = await dbContext.VideoGameCompletions.FindAsync((int)videoGame.CompletionStatus);
        
        if (completionStatus is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified completion status");
        }
        
        var status = await dbContext.VideoGameStatuses.FindAsync((int)videoGame.Status);
        
        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified status");
        }

        var newVideoGame = new VideoGameDto
        {
            VideoGameCompletion = completionStatus,
            VideoGameStatus = status,
            CoverImageUrl = videoGame.CoverImageUrl,
            DateCompleted = videoGame.DateCompleted,
            DateStarted = videoGame.DateStarted,
            Link = videoGame.Link,
            Rating = videoGame.Rating,
            SortOrder = videoGame.SortOrder,
            Thoughts = videoGame.Thoughts,
            Title = videoGame.Title,
            VideoGameToVideoGameGenres = videoGame.Genres
                .Select(g => new VideoGameToVideoGameGenreDto
                {
                    VideoGameGenre = dbContext.VideoGameGenres.First(vgg => vgg.VideoGameGenreId == g.VideoGameGenreId),
                })
                .ToList(),
            VideoGameToVideoGameSystems = videoGame.Systems
                .Select(g => new VideoGameToVideoGameSystemDto
                {
                    VideoGameSystem = dbContext.VideoGameSystems.First(vgs => vgs.VideoGameSystemId == g.VideoGameSystemId)
                })
                .ToList(),
        };

        dbContext.VideoGames.Add(newVideoGame);
        
        await dbContext.SaveChangesAsync();

        return VideoGame.FromDto(newVideoGame);
    }

    public async Task<VideoGame> UpdateVideoGameAsync(VideoGame videoGame)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        var updatedVideoGame = await dbContext.VideoGames.FindAsync(videoGame.VideoGameId);

        if (updatedVideoGame is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified video game");
        }
        
        var completionStatus = await dbContext.VideoGameCompletions.FindAsync((int)videoGame.CompletionStatus);
        
        if (completionStatus is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified completion status");
        }
        
        var status = await dbContext.VideoGameStatuses.FindAsync((int)videoGame.Status);
        
        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified status");
        }

        await Task.WhenAll(
            ClearGenresFromVideoGame(videoGame.VideoGameId),
            ClearSystemsFromVideoGame(videoGame.VideoGameId)
        );

        updatedVideoGame.VideoGameCompletion = completionStatus;
        updatedVideoGame.VideoGameStatus = status;
        updatedVideoGame.Title = videoGame.Title;
        updatedVideoGame.Link = videoGame.Link;
        updatedVideoGame.DateCompleted = videoGame.DateCompleted;
        updatedVideoGame.DateStarted = videoGame.DateStarted;
        updatedVideoGame.Rating = videoGame.Rating;
        updatedVideoGame.Thoughts = videoGame.Thoughts;
        updatedVideoGame.CoverImageUrl = videoGame.CoverImageUrl;
        updatedVideoGame.SortOrder = videoGame.SortOrder;
        
        updatedVideoGame.VideoGameToVideoGameGenres = videoGame.Genres
            .Select(g => new VideoGameToVideoGameGenreDto
            {
                VideoGameGenre = dbContext.VideoGameGenres.First(vgg => vgg.VideoGameGenreId == g.VideoGameGenreId),
            })
            .ToList();
        
        updatedVideoGame.VideoGameToVideoGameSystems = videoGame.Systems
            .Select(g => new VideoGameToVideoGameSystemDto
            {
                VideoGameSystem = dbContext.VideoGameSystems.First(vgs => vgs.VideoGameSystemId == g.VideoGameSystemId)
            })
            .ToList();

        dbContext.VideoGames.Update(updatedVideoGame);

        await dbContext.SaveChangesAsync();

        return VideoGame.FromDto(updatedVideoGame);
    }
    #endregion "Video Games"
    
    #region "Video Game Systems"
    public async Task<VideoGameSystem?> GetVideoGameSystemByIdAsync(int videoGameSystemId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var videoGameSystem = await dbContext.VideoGameSystems.FindAsync(videoGameSystemId);

        return videoGameSystem is not null ? VideoGameSystem.FromDto(videoGameSystem) : null;
    }
    
    public async Task<List<VideoGameSystem>> GetAllVideoGameSystemsAsync()
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var systems = await dbContext.VideoGameSystems
            .OrderBy(vg => vg.Name)
            .ToListAsync();

        return systems.Select(VideoGameSystem.FromDto).ToList();
    }

    public async Task<VideoGameSystem> AddVideoGameSystemAsync(VideoGameSystem videoGameSystem)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        var newVideoGameSystem = new VideoGameSystemDto
        {
            Name = videoGameSystem.Name,
            ColorCode = videoGameSystem.ColorCode,
        };

        dbContext.VideoGameSystems.Add(newVideoGameSystem);

        await dbContext.SaveChangesAsync();

        return VideoGameSystem.FromDto(newVideoGameSystem);
    }

    public async Task<VideoGameSystem> UpdateVideoGameSystemAsync(VideoGameSystem videoGameSystem)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var system = await dbContext.VideoGameSystems.FindAsync(videoGameSystem.VideoGameSystemId);

        if (system is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link type");
        }

        system.Name = videoGameSystem.Name;
        system.ColorCode = videoGameSystem.ColorCode;

        dbContext.VideoGameSystems.Update(system);

        await dbContext.SaveChangesAsync();
        
        return VideoGameSystem.FromDto(system);
    }

    public async Task DeleteVideoGameSystemAsync(int videoGameSystemId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.VideoGameSystems.Where(vgs => vgs.VideoGameSystemId == videoGameSystemId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Video Game Systems"
    
    #region "Video Game Genres"
    public async Task<VideoGameGenre?> GetVideoGameGenreByIdAsync(int videoGameGenreId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var videoGameGenre = await dbContext.VideoGameGenres.FindAsync(videoGameGenreId);

        return videoGameGenre is not null ? VideoGameGenre.FromDto(videoGameGenre) : null;
    }
    
    public async Task<List<VideoGameGenre>> GetAllVideoGameGenresAsync()
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var systems = await dbContext.VideoGameGenres
            .OrderBy(vg => vg.Name)
            .ToListAsync();

        return systems.Select(VideoGameGenre.FromDto).ToList();
    }

    public async Task<VideoGameGenre> AddVideoGameGenreAsync(VideoGameGenre videoGameGenre)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        var newVideoGameGenre = new VideoGameGenreDto
        {
            Name = videoGameGenre.Name,
            ColorCode = videoGameGenre.ColorCode,
        };

        dbContext.VideoGameGenres.Add(newVideoGameGenre);

        await dbContext.SaveChangesAsync();

        return VideoGameGenre.FromDto(newVideoGameGenre);
    }

    public async Task<VideoGameGenre> UpdateVideoGameGenreAsync(VideoGameGenre videoGameGenre)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();

        var genre = await dbContext.VideoGameGenres.FindAsync(videoGameGenre.VideoGameGenreId);

        if (genre is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link type");
        }

        genre.Name = videoGameGenre.Name;
        genre.ColorCode = videoGameGenre.ColorCode;

        dbContext.VideoGameGenres.Update(genre);

        await dbContext.SaveChangesAsync();
        
        return VideoGameGenre.FromDto(genre);
    }

    public async Task DeleteVideoGameGenreAsync(int videoGameGenreId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.VideoGameGenres.Where(vgg => vgg.VideoGameGenreId == videoGameGenreId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Video Game Genres"
    
    #region "Utilities"
    private async Task ClearGenresFromVideoGame(int videoGameId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.VideoGameToVideoGameGenres.Where(vgg => vgg.VideoGameId == videoGameId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    private async Task ClearSystemsFromVideoGame(int videoGameId)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.VideoGameToVideoGameSystems.Where(vgs => vgs.VideoGameId == videoGameId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Utilities"
}