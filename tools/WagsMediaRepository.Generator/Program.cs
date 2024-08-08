using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain;
using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.Configuration;
using WagsMediaRepository.Generator.Models;
using WagsMediaRepository.Infrastructure.Database;
using WagsMediaRepository.Infrastructure.Helpers;
using WagsMediaRepository.Infrastructure.Repositories;

namespace WagsMediaRepository.Generator;

internal class Program
{
    private static DirectoryConfiguration? _configuration;
    
    private static IDbContextFactory<ApplicationDbContext>? _dbContextFactory;
    private static ITelevisionRepository? _televisionRepository;
    private static IPodcastRepository? _podcastRepository;
    private static IMovieRepository? _movieRepository;
    private static ILinkRepository? _linkRepository;
    private static IVideoGameRepository? _videoGameRepository;
    private static IBookRepository? _bookRepository;
    private static IMusicRepository? _musicRepository;

    static async Task Main()
    {
        var appVersion = System.Reflection.Assembly.GetEntryAssembly()?.GetName().Version;
        
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();
        
        _configuration = config.GetRequiredSection("Directory").Get<DirectoryConfiguration>();
        
        if (_configuration is null)
        {
            WriteConsoleError("Unable to read settings");
            return;
        }
        
        var services = new ServiceCollection();
        services.AddSingleton(config);
        services.AddTransient<ITelevisionRepository, TelevisionRepository>();
        services.AddTransient<IPodcastRepository, PodcastRepository>();
        services.AddTransient<IMovieRepository, MovieRepository>();
        services.AddTransient<ILinkRepository, LinkRepository>();
        services.AddTransient<IVideoGameRepository, VideoGameRepository>();
        services.AddTransient<IBookRepository, BookRepository>();
        services.AddTransient<IMusicRepository, MusicRepository>();
        services.AddDbContextFactory<ApplicationDbContext>(opt =>
            opt.UseSqlite(config.GetConnectionString("RepoDb"), b => b.MigrationsAssembly("WagsMediaRepository.Web")));
            
        var serviceProvider = services.BuildServiceProvider();
        
        _televisionRepository = serviceProvider.GetService<ITelevisionRepository>();
        _podcastRepository = serviceProvider.GetService<IPodcastRepository>();
        _movieRepository = serviceProvider.GetService<IMovieRepository>();
        _linkRepository = serviceProvider.GetService<ILinkRepository>();
        _videoGameRepository = serviceProvider.GetService<IVideoGameRepository>();
        _bookRepository = serviceProvider.GetService<IBookRepository>();
        _musicRepository = serviceProvider.GetService<IMusicRepository>();
        _dbContextFactory = serviceProvider.GetService<IDbContextFactory<ApplicationDbContext>>();

        await ProcessBooks();
        await ProcessLinks();
        await ProcessVideoGames();
        await ProcessMovies();
        await ProcessTelevision();
        await ProcessPodcasts();
        await ProcessMusic();
        
        WriteConsoleSuccess("JSON written");
    }

    static async Task ProcessBooks()
    {
        WriteWithColor("Writing books to JSON");
        
        if (_bookRepository is null)
        {
            WriteConsoleError("Error reading book repository");
            return;
        }

        var books = await _bookRepository.GetBooksAsync();

        var toRead = books
            .Where(b => b.BookStatusId == (int)Constants.BookStatus.ToRead)
            .OrderBy(b => b.SortOrder)
            .Select(BookApiModel.FromDomainModel)
            .ToList();
        var currentlyReading = books
            .Where(b => b.BookStatusId == (int)Constants.BookStatus.Reading)
            .Select(BookApiModel.FromDomainModel)
            .ToList();
        var completed = books
            .Where(b => b.BookStatusId == (int)Constants.BookStatus.Finished)
            .ToList();

        var years = completed.Select(b => b.DateCompleted?.Year ?? DateTime.Now.Year).Distinct().ToList();

        var bookYears = new List<BookOutput>();
        
        foreach (var year in years)
        {
            bookYears.Add(new BookOutput
            {
                Year = year.ToString(),
                Books = completed
                    .Where(b => b.DateCompleted?.Year == year)
                    .OrderByDescending(b => b.DateCompleted)
                    .Select(BookApiModel.FromDomainModel)
                    .ToList(),
            });
        }

        var json = JsonSerializer.Serialize(
            new
            {
                inProgress = currentlyReading,
                completed = bookYears.OrderByDescending(b => b.Year),
                toRead,
            }, 
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );

        await WriteJsonToFile(json, "books.json");
    }

    static async Task ProcessLinks()
    {
        WriteWithColor("Writing links to JSON");
        
        if (_linkRepository is null)
        {
            WriteConsoleError("Error reading link repository");
            return;
        }

        var links = await _linkRepository.GetLinksAsync();
        
        var json = JsonSerializer.Serialize(
            links, 
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );
        
        await WriteJsonToFile(json, "links.json");
    }

    static async Task ProcessVideoGames()
    {
        WriteWithColor("Writing video games to JSON");
        
        if (_videoGameRepository is null)
        {
            WriteConsoleError("Error reading video game repository");
            return;
        }

        var videoGames = await _videoGameRepository.GetAllVideoGamesAsync();

        var toPlay = videoGames
            .Where(vg => vg.Status == Constants.VideoGameStatus.ToPlay)
            .OrderBy(vg => vg.SortOrder)
            .Select(VideoGameApiModel.FromDomainModel)
            .ToList();
        var currentlyPlaying = videoGames
            .Where(vg => vg.Status == Constants.VideoGameStatus.InProgress)
            .Select(VideoGameApiModel.FromDomainModel)
            .ToList();
        var completed = videoGames
            .Where(vg => vg.Status == Constants.VideoGameStatus.Completed)
            .OrderByDescending(vg => vg.DateCompleted)
            .Select(VideoGameApiModel.FromDomainModel)
            .ToList();

        var json = JsonSerializer.Serialize(
            new
            {
                inProgress = currentlyPlaying,
                completed,
                toPlay,
            }, 
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );

        await WriteJsonToFile(json, "videoGames.json");
    }
    
    static async Task ProcessMovies()
    {
        WriteWithColor("Writing movies to JSON");
        
        if (_movieRepository is null)
        {
            WriteConsoleError("Error reading movie repository");
            return;
        }

        var movies = await _movieRepository.GetMoviesAsync();

        var toWatch = movies
            .Where(m => m.Status.MovieStatusId == (int)Constants.MovieStatus.JointWatch || m.Status.MovieStatusId == (int)Constants.MovieStatus.PersonalToWatch)
            .OrderBy(m => m.SortOrder)
            .Select(MovieApiModel.FromDomainModel)
            .ToList();
        var finished = movies
            .Where(m => m.Status.MovieStatusId == (int)Constants.MovieStatus.Watched)
            .OrderByDescending(m => m.DateWatched)
            .ToList();
        var abandoned = movies
            .Where(m => m.Status.MovieStatusId == (int)Constants.MovieStatus.CouldNotFinish)
            .OrderByDescending(m => m.DateWatched)
            .Select(MovieApiModel.FromDomainModel)
            .ToList();
        
        var years = finished.Select(m => m.DateWatched?.Year ?? DateTime.Now.Year).Distinct().ToList();

        var movieYears = new List<MovieOutput>();
        
        foreach (var year in years)
        {
            movieYears.Add(new MovieOutput
            {
                Year = year.ToString(),
                Movies = finished
                    .Where(m => m.DateWatched?.Year == year)
                    .OrderByDescending(m => m.DateWatched)
                    .Select(MovieApiModel.FromDomainModel)
                    .ToList()
            });
        }

        var json = JsonSerializer.Serialize(
            new
            {
                toWatch,
                watched = movieYears.OrderByDescending(m => m.Year),
                abandoned,
            }, 
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );

        await WriteJsonToFile(json, "movies.json");
    }
    
    static async Task ProcessTelevision()
    {
        WriteWithColor("Writing TV to JSON");
        
        if (_televisionRepository is null)
        {
            WriteConsoleError("Error reading TV repository");
            return;
        }

        var tvShows = await _televisionRepository.GetTelevisionShowsAsync();

        var toWatch = tvShows
            .Where(t => t.Status.TelevisionStatusId == (int)Constants.TelevisionStatus.JointWatch || t.Status.TelevisionStatusId == (int)Constants.TelevisionStatus.PersonalToWatch)
            .OrderBy(m => m.SortOrder)
            .Select(TelevisionShowApiModel.FromDomainModel)
            .ToList();
        var inProgress = tvShows
            .Where(t => t.Status.TelevisionStatusId == (int)Constants.TelevisionStatus.Watching)
            .OrderBy(t => Sorters.SortByTitle(t.Title))
            .Select(TelevisionShowApiModel.FromDomainModel)
            .ToList();
        var betweenSeasons = tvShows
            .Where(t => t.Status.TelevisionStatusId == (int)Constants.TelevisionStatus.InBetweenSeasons)
            .OrderBy(t => Sorters.SortByTitle(t.Title))
            .Select(TelevisionShowApiModel.FromDomainModel)
            .ToList();
        var completed = tvShows
            .Where(t => t.Status.TelevisionStatusId == (int)Constants.TelevisionStatus.Watched)
            .OrderBy(t => Sorters.SortByTitle(t.Title))
            .Select(TelevisionShowApiModel.FromDomainModel)
            .ToList();
        var abandoned = tvShows
            .Where(t => t.Status.TelevisionStatusId == (int)Constants.TelevisionStatus.CouldNotFinish)
            .OrderBy(t => Sorters.SortByTitle(t.Title))
            .Select(TelevisionShowApiModel.FromDomainModel)
            .ToList();

        var json = JsonSerializer.Serialize(
            new
            {
                toWatch,
                inProgress,
                betweenSeasons,
                completed,
                abandoned,
            }, 
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );

        await WriteJsonToFile(json, "tv.json");
    }
    
    static async Task ProcessPodcasts()
    {
        WriteWithColor("Writing podcasts to JSON");
        
        if (_podcastRepository is null)
        {
            WriteConsoleError("Error reading podcast repository");
            return;
        }

        var podcastCategoriesTask = _podcastRepository.GetCategoriesAsync();
        var podcastsTask = _podcastRepository.GetPodcastsAsync();

        await Task.WhenAll(podcastCategoriesTask, podcastsTask);

        var categories = podcastCategoriesTask.Result;
        var podcasts = podcastsTask.Result;

        var podcastOutput = new List<PodcastOutput>();
        
        foreach (var category in categories)
        {
            podcastOutput.Add(new PodcastOutput
            {
                Name = category.Name, 
                Podcasts = podcasts
                    .Where(p => p.PodcastCategoryId == category.PodcastCategoryId)
                    .OrderBy(p => Sorters.SortByTitle(p.Name))
                    .Select(PodcastApiModel.FromDomainModel)
                    .ToList()
            });
        }

        var json = JsonSerializer.Serialize(
            podcastOutput,
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );

        await WriteJsonToFile(json, "podcasts.json");
    }
    
    static async Task ProcessMusic()
    {
        WriteWithColor("Writing music to JSON");
        
        if (_musicRepository is null)
        {
            WriteConsoleError("Error reading music repository");
            return;
        }

        var albums = await _musicRepository.GetAlbumsAsync();

        var json = JsonSerializer.Serialize(
            albums.OrderBy(a => Sorters.SortByTitle(a.Artist)).ThenBy(a => Sorters.SortByTitle(a.Title)).Select(MusicAlbumApiModel.FromDomainModel).ToList(), 
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );

        await WriteJsonToFile(json, "music.json");
    }
    
    static async Task WriteJsonToFile(string json, string filename)
    {
        var path = Path.Join(_configuration?.Output, filename);

        if (File.Exists(path))
        {
            File.Delete(path);
        }

        await using var sw = new StreamWriter(path, false);
        
        await sw.WriteAsync(json);
    }
    
    static void WriteConsoleError(string errorMessage)
    {
        WriteWithColor(errorMessage, ConsoleColor.Red);
    }

    static void WriteConsoleSuccess(string successMessage)
    {
        WriteWithColor(successMessage, ConsoleColor.Green);
    }

    static void WriteWithColor(string message, ConsoleColor color = ConsoleColor.White)
    {
        Console.ForegroundColor = color;
        Console.WriteLine(message);
        Console.ResetColor();
    }
}