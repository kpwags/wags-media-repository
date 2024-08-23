using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain.Dtos;
using WagsMediaRepository.Domain.Exceptions;
using WagsMediaRepository.Infrastructure.Database;
using WagsMediaRepository.Infrastructure.Helpers;

namespace WagsMediaRepository.Infrastructure.Repositories;

public class MovieRepository(IDbContextFactory<ApplicationDbContext> dbContextFactory) : IMovieRepository
{
    #region "Movie Status"
    
    public async Task<List<MovieStatus>> GetStatusesAsync()
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var movieStatuses = await dbContext.MovieStatuses.ToListAsync();

        return movieStatuses.Select(MovieStatus.FromDto).ToList();
    }
    
    #endregion "Movie Status"

    #region "Movie Genre"
    
    public async Task<MovieGenre?> GetGenreByIdAsync(int genreId)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var genre = await dbContext.MovieGenres.FindAsync(genreId);

        return genre is null ? null : MovieGenre.FromDto(genre);
    }

    public async Task<List<MovieGenre>> GetGenresAsync()
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var movieGenres = await dbContext.MovieGenres.ToListAsync();

        return movieGenres
            .OrderBy(g => g.Name)
            .Select(MovieGenre.FromDto)
            .ToList();
    }

    public async Task<MovieGenre> AddGenreAsync(MovieGenre genre)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var newGenre = new MovieGenreDto
        {
            Name = genre.Name,
            ColorCode = genre.ColorCode,
        };

        dbContext.MovieGenres.Add(newGenre);

        await dbContext.SaveChangesAsync();

        return MovieGenre.FromDto(newGenre);
    }

    public async Task<MovieGenre> UpdateGenreAsync(MovieGenre genre)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var genreToUpdate = await dbContext.MovieGenres.FindAsync(genre.MovieGenreId);

        if (genreToUpdate is null)
        {
            throw new ObjectNotFoundException("Unable to find movie genre");
        }

        genreToUpdate.Name = genre.Name;
        genreToUpdate.ColorCode = genre.ColorCode;

        dbContext.MovieGenres.Update(genreToUpdate);

        await dbContext.SaveChangesAsync();

        return MovieGenre.FromDto(genreToUpdate);
    }

    public async Task DeleteGenreAsync(int genreId)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        await dbContext.MovieGenres.Where(mg => mg.MovieGenreId == genreId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion "Movie Genre"

    #region "Movie Service"
    
    public async Task<MovieService?> GetServiceByIdAsync(int serviceId)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var service = await dbContext.MovieServices.FindAsync(serviceId);

        return service is null ? null : MovieService.FromDto(service);
    }

    public async Task<List<MovieService>> GetServicesAsync()
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var services = await dbContext.MovieServices.ToListAsync();

        return services
            .OrderBy(s => s.Name)
            .Select(MovieService.FromDto)
            .ToList();
    }

    public async Task<MovieService> AddServiceAsync(MovieService service)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var newService = new MovieServiceDto
        {
            Name = service.Name,
            ColorCode = service.ColorCode,
        };

        dbContext.MovieServices.Add(newService);

        await dbContext.SaveChangesAsync();

        return MovieService.FromDto(newService);
    }

    public async Task<MovieService> UpdateServiceAsync(MovieService service)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var serviceToUpdate = await dbContext.MovieServices.FindAsync(service.MovieServiceId);

        if (serviceToUpdate is null)
        {
            throw new ObjectNotFoundException("Unable to find movie genre");
        }

        serviceToUpdate.Name = service.Name;
        serviceToUpdate.ColorCode = service.ColorCode;

        dbContext.MovieServices.Update(serviceToUpdate);

        await dbContext.SaveChangesAsync();

        return MovieService.FromDto(serviceToUpdate);
    }

    public async Task DeleteServiceAsync(int serviceId)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        await dbContext.MovieServices.Where(ms => ms.MovieServiceId == serviceId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion "Movie Service"

    #region "Movie"
    
    public async Task<Movie?> GetMovieById(int movieId)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var movie = await dbContext.Movies
            .Include(m => m.MovieStatus)
            .Include(m => m.MovieToMovieGenres)
            .ThenInclude(mg => mg.MovieGenre)
            .Include(m => m.MovieToMovieServices)
            .ThenInclude(ms => ms.MovieService)
            .FirstOrDefaultAsync(m => m.MovieId == movieId);

        return movie is null ? null : Movie.FromDto(movie);
    }

    public async Task<List<Movie>> GetMoviesAsync()
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var movies = await dbContext.Movies
            .Include(m => m.MovieStatus)
            .Include(m => m.MovieToMovieGenres)
            .ThenInclude(mg => mg.MovieGenre)
            .Include(m => m.MovieToMovieServices)
            .ThenInclude(ms => ms.MovieService)
            .ToListAsync();

        return movies
            .Select(Movie.FromDto)
            .OrderBy(m => Sorters.SortByTitle(m.Title))
            .ToList();
    }

    public async Task<Movie> AddMovieAsync(Movie movie)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var status = await dbContext.MovieStatuses.FindAsync(movie.MovieStatusId);

        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find movie status");
        }
        
        var newMovie = new MovieDto
        {
            Title = movie.Title,
            MovieStatus = status,
            DateWatched = movie.DateWatched,
            SortOrder = movie.SortOrder,
            ImdbLink = movie.ImdbLink,
            PosterImageUrl = movie.PosterImageUrl,
            Thoughts = movie.Thoughts,
            Rating = movie.Rating,
            MovieToMovieGenres = movie.Genres
                .Select(g => new MovieToMovieGenreDto
                {
                    MovieGenre = dbContext.MovieGenres.First(mg => mg.MovieGenreId == g.MovieGenreId),
                })
                .ToList(),
            MovieToMovieServices = movie.Services
                .Select(s => new MovieToMovieServiceDto()
                {
                    MovieService = dbContext.MovieServices.First(ms => ms.MovieServiceId == s.MovieServiceId),
                })
                .ToList(),
        };

        dbContext.Movies.Add(newMovie);

        await dbContext.SaveChangesAsync();

        return Movie.FromDto(newMovie);
    }

    public async Task<Movie> UpdateMovieAsync(Movie movie)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        var movieToUpdate = await dbContext.Movies.FindAsync(movie.MovieId);

        if (movieToUpdate is null)
        {
            throw new ObjectNotFoundException("Unable to find movie");
        }
        
        var status = await dbContext.MovieStatuses.FindAsync(movie.MovieStatusId);

        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find movie status");
        }

        await Task.WhenAll(
            ClearGenresFromMovie(movie.MovieId),
            ClearServicesFromMovie(movie.MovieId)
        );

        movieToUpdate.Title = movie.Title;
        movieToUpdate.MovieStatus = status;
        movieToUpdate.DateWatched = movie.DateWatched;
        movieToUpdate.SortOrder = movie.SortOrder;
        movieToUpdate.ImdbLink = movie.ImdbLink;
        movieToUpdate.PosterImageUrl = movie.PosterImageUrl;
        movieToUpdate.Thoughts = movie.Thoughts;
        movieToUpdate.Rating = movie.Rating;
        movieToUpdate.MovieToMovieGenres = movie.Genres
            .Select(g => new MovieToMovieGenreDto
            {
                MovieGenre = dbContext.MovieGenres.First(mg => mg.MovieGenreId == g.MovieGenreId),
            })
            .ToList();
        movieToUpdate.MovieToMovieServices = movie.Services
            .Select(s => new MovieToMovieServiceDto()
            {
                MovieService = dbContext.MovieServices.First(ms => ms.MovieServiceId == s.MovieServiceId),
            })
            .ToList();

        dbContext.Movies.Update(movieToUpdate);

        await dbContext.SaveChangesAsync();

        return Movie.FromDto(movieToUpdate);
    }

    public async Task DeleteMovieAsync(int movieId)
    {
        var dbContext = await dbContextFactory.CreateDbContextAsync();

        await dbContext.Movies.Where(m => m.MovieId == movieId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion "Movie"
    
    #region "Utilities"
    private async Task ClearGenresFromMovie(int movieId)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        
        await dbContext.MovieToMovieGenres.Where(mg => mg.MovieId == movieId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    private async Task ClearServicesFromMovie(int movieId)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        
        await dbContext.MovieToMovieServicess.Where(ms => ms.MovieId == movieId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Utilities"
}