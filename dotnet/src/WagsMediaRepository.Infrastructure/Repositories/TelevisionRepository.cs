using System.Globalization;
using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain.Dtos;
using WagsMediaRepository.Domain.Exceptions;
using WagsMediaRepository.Infrastructure.Database;
using WagsMediaRepository.Infrastructure.Helpers;

namespace WagsMediaRepository.Infrastructure.Repositories;

public class TelevisionRepository(IDbContextFactory<ApplicationDbContext> dbContextFactory) : ITelevisionRepository
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory = dbContextFactory;
    
    #region "Statuses"
    
    public async Task<List<TelevisionStatus>> GetStatusesAsync()
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var statuses = await dbContext.TelevisionStatuses.ToListAsync();

        return statuses.Select(TelevisionStatus.FromDto).ToList();
    }
    
    #endregion "Statuses"
    
    #region "Services"

    public async Task<TelevisionService?> GetServiceByIdAsync(int serviceId)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var service = await dbContext.TelevisionServices.FindAsync(serviceId);

        return service is not null ? TelevisionService.FromDto(service) : null;
    }

    public async Task<List<TelevisionService>> GetServicesAsync()
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var services = await dbContext.TelevisionServices.ToListAsync();

        return services
            .OrderBy(s => s.Name)
            .Select(TelevisionService.FromDto)
            .ToList();
    }

    public async Task<TelevisionService> AddServiceAsync(TelevisionService service)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var services = await dbContext.TelevisionServices.ToListAsync();

        if (services.Exists(s => s.Name.ToLower(CultureInfo.InvariantCulture) == service.Name.ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A service with the name '{service.Name}' already exists");
        }

        var newService = new TelevisionServiceDto
        {
            Name = service.Name,
            ColorCode = service.ColorCode,
        };

        dbContext.TelevisionServices.Add(newService);

        await dbContext.SaveChangesAsync();

        return TelevisionService.FromDto(newService);
    }

    public async Task<TelevisionService> UpdateServiceAsync(TelevisionService service)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();
        
        var services = await dbContext.TelevisionServices.Where(ts => ts.TelevisionServiceId != service.TelevisionServiceId).ToListAsync();

        if (services.Exists(s => s.Name.ToLower(CultureInfo.InvariantCulture) == service.Name.ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A service with the name '{service.Name}' already exists");
        }

        var serviceToUpdate = await dbContext.TelevisionServices.FindAsync(service.TelevisionServiceId);

        if (serviceToUpdate is null)
        {
            throw new ObjectNotFoundException("Could not find specified service");
        }

        serviceToUpdate.Name = service.Name;
        serviceToUpdate.ColorCode = service.ColorCode;

        dbContext.TelevisionServices.Update(serviceToUpdate);

        await dbContext.SaveChangesAsync();

        return TelevisionService.FromDto(serviceToUpdate);
    }

    public async Task DeleteServiceAsync(int serviceId)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        await dbContext.TelevisionServices.Where(ts => ts.TelevisionServiceId == serviceId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion "Services"
    
    #region "Genres"

    public async Task<TelevisionGenre?> GetGenreByIdAsync(int genreId)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var genre = await dbContext.TelevisionGenres.FindAsync(genreId);

        return genre is not null ? TelevisionGenre.FromDto(genre) : null;
    }

    public async Task<List<TelevisionGenre>> GetGenresAsync()
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var genres = await dbContext.TelevisionGenres.ToListAsync();

        return genres
            .OrderBy(g => g.Name)
            .Select(TelevisionGenre.FromDto)
            .ToList();
    }

    public async Task<TelevisionGenre> AddGenreAsync(TelevisionGenre genre)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var genres = await dbContext.TelevisionGenres.ToListAsync();

        if (genres.Exists(g => g.Name.ToLower(CultureInfo.InvariantCulture) == genre.Name.ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A genre with the name '{genre.Name}' already exists");
        }

        var newGenre = new TelevisionGenreDto
        {
            Name = genre.Name,
            ColorCode = genre.ColorCode,
        };

        dbContext.TelevisionGenres.Add(newGenre);

        await dbContext.SaveChangesAsync();

        return TelevisionGenre.FromDto(newGenre);
    }

    public async Task<TelevisionGenre> UpdateGenreAsync(TelevisionGenre genre)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();
        
        var genres = await dbContext.TelevisionGenres.Where(tg => tg.TelevisionGenreId != genre.TelevisionGenreId).ToListAsync();

        if (genres.Exists(g => g.Name.ToLower(CultureInfo.InvariantCulture) == genre.Name.ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A genre with the name '{genre.Name}' already exists");
        }

        var genreToUpdate = await dbContext.TelevisionGenres.FindAsync(genre.TelevisionGenreId);

        if (genreToUpdate is null)
        {
            throw new ObjectNotFoundException("Could not find specified genre");
        }

        genreToUpdate.Name = genre.Name;
        genreToUpdate.ColorCode = genre.ColorCode;

        dbContext.TelevisionGenres.Update(genreToUpdate);

        await dbContext.SaveChangesAsync();

        return TelevisionGenre.FromDto(genreToUpdate);
    }

    public async Task DeleteGenreAsync(int genreId)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        await dbContext.TelevisionGenres.Where(tg => tg.TelevisionGenreId == genreId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion "Genres"
    
    #region "Shows"

    public async Task<TelevisionShow?> GetTelevisionShowByIdAsync(int showId)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var show = await dbContext.TelevisionShows
            .Include(t => t.TelevisionStatus)
            .Include(t => t.TelevisionToTelevisionGenres)
            .ThenInclude(tg => tg.TelevisionGenre)
            .Include(t => t.TelevisionToTelevisionServices)
            .ThenInclude(ts => ts.TelevisionService)
            .FirstOrDefaultAsync(t => t.TelevisionShowId == showId);

        return show is not null ? TelevisionShow.FromDto(show) : null;
    }

    public async Task<List<TelevisionShow>> GetTelevisionShowsAsync()
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var shows = await dbContext.TelevisionShows
            .Include(t => t.TelevisionStatus)
            .Include(t => t.TelevisionToTelevisionGenres)
            .ThenInclude(tg => tg.TelevisionGenre)
            .Include(t => t.TelevisionToTelevisionServices)
            .ThenInclude(ts => ts.TelevisionService)
            .ToListAsync();

        return shows
            .OrderBy(ts => Sorters.SortByTitle(ts.Title))
            .Select(TelevisionShow.FromDto).ToList();
    }

    public async Task<TelevisionShow> AddTelevisionShowAsync(TelevisionShow show)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();
        
        var status = await dbContext.TelevisionStatuses.FindAsync(show.TelevisionStatusId);

        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find tv status");
        }
        
        var newTvShow = new TelevisionShowDto
        {
            Title = show.Title,
            TelevisionStatus = status,
            SortOrder = show.SortOrder,
            ImdbLink = show.ImdbLink,
            CoverImageUrl = show.CoverImageUrl,
            Thoughts = show.Thoughts,
            Rating = show.Rating,
            CurrentSeason = show.CurrentSeason,
            NumberOfSeasons = show.NumberOfSeasons,
            TelevisionToTelevisionGenres = show.Genres
                .Select(g => new TelevisionShowToTelevisionGenreDto
                {
                    TelevisionGenre = dbContext.TelevisionGenres.First(tg => tg.TelevisionGenreId == g.TelevisionGenreId),
                })
                .ToList(),
            TelevisionToTelevisionServices = show.Services
                .Select(s => new TelevisionShowToTelevisionServiceDto
                {
                    TelevisionService = dbContext.TelevisionServices.First(ts => ts.TelevisionServiceId == s.TelevisionServiceId),
                })
                .ToList(),
        };

        dbContext.TelevisionShows.Add(newTvShow);

        await dbContext.SaveChangesAsync();

        return TelevisionShow.FromDto(newTvShow);
    }

    public async Task<TelevisionShow> UpdateTelevisionShowAsync(TelevisionShow show)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();
        
        var status = await dbContext.TelevisionStatuses.FindAsync(show.TelevisionStatusId);

        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find tv status");
        }
        
        var showToUpdate = await dbContext.TelevisionShows.FindAsync(show.TelevisionShowId);

        if (showToUpdate is null)
        {
            throw new ObjectNotFoundException("Unable to find tv show");
        }
        
        await Task.WhenAll(
            ClearGenresFromTvShow(show.TelevisionShowId),
            ClearServicesFromTvShow(show.TelevisionShowId)
        );
        
        showToUpdate.Title = show.Title;
        showToUpdate.TelevisionStatus = status;
        showToUpdate.SortOrder = show.SortOrder;
        showToUpdate.ImdbLink = show.ImdbLink;
        showToUpdate.CoverImageUrl = show.CoverImageUrl;
        showToUpdate.Thoughts = show.Thoughts;
        showToUpdate.Rating = show.Rating;
        showToUpdate.CurrentSeason = show.CurrentSeason;
        showToUpdate.NumberOfSeasons = show.NumberOfSeasons;
        showToUpdate.TelevisionToTelevisionGenres = show.Genres
            .Select(g => new TelevisionShowToTelevisionGenreDto
            {
                TelevisionGenre = dbContext.TelevisionGenres.First(tg => tg.TelevisionGenreId == g.TelevisionGenreId),
            })
            .ToList();
        showToUpdate.TelevisionToTelevisionServices = show.Services
            .Select(s => new TelevisionShowToTelevisionServiceDto
            {
                TelevisionService = dbContext.TelevisionServices.First(ts => ts.TelevisionServiceId == s.TelevisionServiceId),
            })
            .ToList();

        dbContext.TelevisionShows.Update(showToUpdate);

        await dbContext.SaveChangesAsync();

        return TelevisionShow.FromDto(showToUpdate);
    }

    public async Task DeleteTelevisionShowAsync(int showId)
    {
        var dbContext = await _dbContextFactory.CreateDbContextAsync();

        await dbContext.TelevisionShows.Where(t => t.TelevisionShowId == showId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion "Shows"
    
    #region "Utilities"
    private async Task ClearGenresFromTvShow(int showId)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync();
        
        await dbContext.TelevisionToTelevisionGenres.Where(tg => tg.TelevisionShowId == showId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    private async Task ClearServicesFromTvShow(int showId)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync();
        
        await dbContext.TelevisionToTelevisionServices.Where(ts => ts.TelevisionShowId == showId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Utilities"
}