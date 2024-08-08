using System.Globalization;
using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Infrastructure.Database;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain;
using WagsMediaRepository.Domain.Models;
using WagsMediaRepository.Infrastructure.Repositories;
using WagsMediaRepository.Loader.Configuration;

namespace WagsMediaRepository.Loader;

internal class Program
{
    private static NotionConfiguration? _notionConfiguration;

    private static NotionService? _notionService;
    
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
        
        _notionConfiguration = config.GetRequiredSection("Notion").Get<NotionConfiguration>();
        
        if (_notionConfiguration is null)
        {
            WriteConsoleError("Unable to read settings");
            return;
        }

        _notionService = new NotionService(_notionConfiguration);
        
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

        if (_dbContextFactory is null || _televisionRepository is null)
        {
            WriteConsoleError("Error instantiating services");
            return;
        }
        
        WriteWithColor($"Wags Media Repository Loader (v{appVersion?.Major}.{appVersion?.Minor}.{appVersion?.Build})", ConsoleColor.Cyan);
        Console.WriteLine("");
        Console.WriteLine("Please Specify Content");
        Console.WriteLine("1. TV");
        Console.WriteLine("2. Podcasts");
        Console.WriteLine("3. Movies");
        Console.WriteLine("4. Link");
        Console.WriteLine("5. Music");
        Console.WriteLine("6. Video Games");
        Console.WriteLine("7. Books");
        Console.WriteLine("");
        
        try
        {
            var choice = Utilities.GetInteger("Selection");
        
            Console.WriteLine("");

            switch ((NotionContent)choice)
            {
                case NotionContent.Television:
                    await LoadTelevisionShows();
                    break;
                case NotionContent.Podcast:
                    await LoadPodcasts();
                    break;
                case NotionContent.Movie:
                    await LoadMovies();
                    break;
                case NotionContent.Link:
                    await LoadLinks();
                    break;
                case NotionContent.VideoGame:
                    await LoadVideoGames();
                    break;
                case NotionContent.Books:
                    await LoadBooks();
                    break;
                case NotionContent.Music:
                    await LoadMusic();
                    break;
                default:
                    throw new Exception("Invalid selection");
            }
            
            WriteConsoleSuccess("Done!");
        }
        catch (Exception e)
        {
            WriteConsoleError(e.Message);
        }
    }

    static async Task LoadTelevisionShows()
    {
        if (_notionService is null)
        {
            throw new NullReferenceException("Notion Service is null");
        }
        
        if (_televisionRepository is null)
        {
            throw new NullReferenceException("Television Repository is null");
        }
        
        var tvShows = await _notionService.LoadTelevisionShows();

        foreach (var tv in tvShows)
        {
               
            await _televisionRepository.AddTelevisionShowAsync(new TelevisionShow
            {
                Title = tv.Title,
                ImdbLink = tv.Link,
                Rating = tv.Rating,
                Thoughts = tv.Thoughts,
                CoverImageUrl = tv.CoverUrl,
                TelevisionStatusId = GetTelevisionStatus(tv.Status),
            });
        }
    }

    static async Task LoadPodcasts()
    {
        if (_notionService is null)
        {
            throw new NullReferenceException("Notion Service is null");
        }
        
        if (_podcastRepository is null)
        {
            throw new NullReferenceException("Podcasts Repository is null");
        }

        var categories = await _podcastRepository.GetCategoriesAsync();
        
        var podcasts = await _notionService.LoadPodcasts();

        foreach (var podcast in podcasts)
        {
               
            await _podcastRepository.AddPodcastAsync(new Podcast
            {
                Name = podcast.Name,
                Link = podcast.Link,
                CoverImageUrl = podcast.ImageUrl,
                PodcastCategoryId = GetPodcastCategoryId(podcast.Category, categories),
            });
        }
    }

    static async Task LoadMovies()
    {
        if (_notionService is null)
        {
            throw new NullReferenceException("Notion Service is null");
        }
        
        if (_movieRepository is null)
        {
            throw new NullReferenceException("Movies Repository is null");
        }

        var services = await _movieRepository.GetServicesAsync();
        
        var movies = await _notionService.LoadMovies();

        foreach (var movie in movies)
        {
               
            await _movieRepository.AddMovieAsync(new Movie
            {
                Title = movie.Title,
                MovieStatusId = GetMovieStatus(movie.Status),
                ImdbLink = movie.ImdbLink,
                DateWatched = movie.DateWatched,
                Rating = movie.Rating,
                Thoughts = movie.Thoughts,
                PosterImageUrl = movie.CoverUrl,
                Services = movie.Services
                    .Split(',')
                    .Select(s => GetMovieService(s, services))
                    .Where(s => s > 0)
                    .Select(s => new MovieService { MovieServiceId = s })
                    .ToList(),
            });
        }
    }

    static async Task LoadLinks()
    {
        if (_notionService is null)
        {
            throw new NullReferenceException("Notion Service is null");
        }
        
        if (_linkRepository is null)
        {
            throw new NullReferenceException("Link Repository is null");
        }

        var categoriesTask = _linkRepository.GetLinkCategoriesAsync();
        var existingLinksTask = _linkRepository.GetLinksAsync();

        await Task.WhenAll(categoriesTask, existingLinksTask);

        var categories = categoriesTask.Result;
        var existingLinks = existingLinksTask.Result;
        
        var links = await _notionService.LoadLinks();

        foreach (var link in links)
        {
            if (!existingLinks.Exists(l => l.Url == link.Link))
            {
                await _linkRepository.AddLinkAsync(new Link
                {
                    Title = link.Title,
                    LinkTypeId = GetLinkType(link.Type),
                    LinkCategoryId = GetLinkCategory(link.Category, categories),
                    Url = link.Link,
                    Author = link.Author,
                    LinkDate = link.DateRead,
                    ReadingLogIssueNumber = link.Issue,
                });
            }
        }
    }
    
    static async Task LoadVideoGames()
    {
        if (_notionService is null)
        {
            throw new NullReferenceException("Notion Service is null");
        }
        
        if (_videoGameRepository is null)
        {
            throw new NullReferenceException("Movies Repository is null");
        }
        
        var videoGames = await _notionService.LoadVideoGames();

        foreach (var videoGame in videoGames)
        {
               
            await _videoGameRepository.AddVideoGameAsync(new VideoGame
            {
                Title = videoGame.Title,
                Link = videoGame.Link,
                DateStarted = videoGame.DateStarted,
                DateCompleted = videoGame.DateCompleted,
                Rating = videoGame.Rating,
                Thoughts = videoGame.Thoughts,
                CoverImageUrl = videoGame.CoverUrl,
                Status = (Constants.VideoGameStatus)GetVideoGameStatus(videoGame.Status),
                CompletionStatus = GetVideoGameCompleteStatus(videoGame.CompletionStatus),
                Systems = [new VideoGameSystem { VideoGameSystemId = GetVideoGameSystem(videoGame.Platforms) }]
            });
        }
    }
    
    static async Task LoadBooks()
    {
        if (_notionService is null)
        {
            throw new NullReferenceException("Notion Service is null");
        }
        
        if (_bookRepository is null)
        {
            throw new NullReferenceException("Book Repository is null");
        }
        
        var books = await _notionService.LoadBooks();

        foreach (var book in books)
        {
            await _bookRepository.AddBookAsync(new Book
            {
                BookStatusId = GetBookStatusId(book.Status),
                BookTypeId = GetBookTypeId(book.Type),
                Title = book.Title,
                SubTitle = book.Subtitle,
                Author = book.Author,
                Link = book.Link,
                DateStarted = book.DateStarted,
                DateCompleted = book.DateCompleted,
                Rating = book.Rating,
                BookNotesUrl = book.BookReviewUrl,
                Thoughts = book.Thoughts,
                CoverImageUrl = book.CoverUrl,
                IsAtLibrary = book.LibraryHasIt,
                IsPurchased = book.Purchased,
                CurrentPage = book.CurrentPage,
                PageCount = book.PageCount,
                SortOrder = book.BacklogId == 0 ? null : book.BacklogId,
            });
        }
    }

    static async Task LoadMusic()
    {
        if (_notionService is null)
        {
            throw new NullReferenceException("Notion Service is null");
        }
        
        if (_musicRepository is null)
        {
            throw new NullReferenceException("Music Repository is null");
        }

        var genres = await _musicRepository.GetGenresAsync();
        var formats = await _musicRepository.GetFormatsAsync();
        
        var musicAlbums = await _notionService.LoadMusic();

        foreach (var album in musicAlbums)
        {

            await _musicRepository.AddAlbumAsync(new MusicAlbum
            {
                Title = album.Album,
                Artist = album.Artist,
                CoverImageUrl = album.CoverUrl,
                IsTopTen = album.IsTopTen,
                ShowOnNowPage = album.ShowOnNow,
                Genres = GetAlbumGenres(genres, album.Genres).Select(g => new MusicGenre { MusicGenreId = g }).ToList(),
                Formats = GetAlbumFormats(formats, album.Formats).Select(f => new MusicFormat { MusicFormatId = f }).ToList(),
            });
        }
    }
    
    static int GetTelevisionStatus(string notionStatus) => notionStatus.ToLower(CultureInfo.InvariantCulture) switch
    {
        "personal to-watch" => 1,
        "joint to-watch" => 2,
        "in progress" => 3,
        "between seasons" => 4,
        "completed" => 5,
        _ => 1,
    };

    static int GetPodcastCategoryId(string category, List<PodcastCategory> categories) => category.ToLower(CultureInfo.InvariantCulture) switch
    {
        "business & economics" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "business & economics").PodcastCategoryId,
        "everything else" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "uncategorized").PodcastCategoryId,
        "food" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "food").PodcastCategoryId,
        "gaming" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "gaming").PodcastCategoryId,
        "health & fitness" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "health & fitness").PodcastCategoryId,
        "history" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "history").PodcastCategoryId,
        "news" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "news").PodcastCategoryId,
        "personal finance & investing" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "finance & investing").PodcastCategoryId,
        "politics" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "politics").PodcastCategoryId,
        "science" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "science").PodcastCategoryId,
        "software development" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "software development").PodcastCategoryId,
        "sports" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "sports").PodcastCategoryId, 
        "stories" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "stories").PodcastCategoryId,
        "tech & design" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "tech & design").PodcastCategoryId,
        _ => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "uncategorized").PodcastCategoryId,
    };

    static int GetMovieService(string serviceName, List<MovieService> services) => serviceName.ToLower(CultureInfo.InvariantCulture) switch
    {
        "appletv" => services.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "appletv").MovieServiceId,
        "hbo" => services.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "hbo").MovieServiceId,
        "hulu" => services.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "hulu").MovieServiceId,
        "netflix" => services.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "netflix").MovieServiceId,
        "paramount+" => services.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "paramount+").MovieServiceId,
        _ => 0
    };

    static int GetMovieStatus(string notionStatus) => notionStatus.ToLower(CultureInfo.InvariantCulture) switch
    {
        "to watch" => 1,
        "watched" => 3,
        "couldn't finish" => 4,
        _ => 1,
    };
    
    static int GetVideoGameStatus(string notionStatus) => notionStatus.ToLower(CultureInfo.InvariantCulture) switch
    {
        "to play" => 1,
        "current" => 2,
        "completed" => 3,
        _ => 1,
    };
    
    static int GetVideoGameSystem(string notionSystem) => notionSystem.ToLower(CultureInfo.InvariantCulture) switch
    {
        "pc" => 1,
        "switch" => 2,
        "playstation" => 3,
        "xbox" => 4,
        _ => 1,
    };

    static Constants.VideoGameCompletionStatus GetVideoGameCompleteStatus(string notionStatus) => notionStatus.ToLower(CultureInfo.InvariantCulture) switch
    {
        "n/a" => Constants.VideoGameCompletionStatus.NotApplicable,
        "yes" => Constants.VideoGameCompletionStatus.Yes,
        "no" => Constants.VideoGameCompletionStatus.No,
        _ => Constants.VideoGameCompletionStatus.NotApplicable,
    };
    
    static int GetBookStatusId(string notionStatus) => notionStatus.ToLower(CultureInfo.InvariantCulture) switch
    {
        "not started" => 1,
        "in progress" => 2,
        "completed" => 3,
        _ => 1,
    };
    
    static int GetBookTypeId(string notionStatus) => notionStatus.ToLower(CultureInfo.InvariantCulture) switch
    {
        "fiction" => 1,
        "non-fiction" => 2,
        "reference" => 3,
        _ => 1,
    };

    static int GetLinkType(string linkType) => linkType.ToLower(CultureInfo.InvariantCulture) switch
    {
        "link" => 1,
        "podcast" => 2,
        "video" => 3,
        _ => 1
    };

    static int GetLinkCategory(string category, List<LinkCategory> categories) => category.ToLower(CultureInfo.InvariantCulture) switch
    {
        ".net" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == ".net").LinkCategoryId,
        "business & finance" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "business & finance").LinkCategoryId,
        "climate change" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "climate").LinkCategoryId,
        "design" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "design").LinkCategoryId,
        "everything else" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "everything else").LinkCategoryId,
        "gaming" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "gaming").LinkCategoryId,
        "general development" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "general development").LinkCategoryId,
        "health & fitness" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "health & fitness").LinkCategoryId,
        "in depth" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == ".everything else").LinkCategoryId,
        "journalism" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "journalism").LinkCategoryId,
        "longform" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "longform").LinkCategoryId,
        "media & entertainment" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "media & entertainment").LinkCategoryId,
        "podcasts" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "podcasts").LinkCategoryId,
        "politics" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "politics").LinkCategoryId,
        "science" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "science").LinkCategoryId,
        "space" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "space").LinkCategoryId,
        "sports" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "sports").LinkCategoryId,
        "technology" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "technology").LinkCategoryId,
        "the internet" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "the internet").LinkCategoryId,
        "web development" => categories.First(c => c.Name.ToLower(CultureInfo.InvariantCulture) == "web development").LinkCategoryId,
        _ => 4
    };

    static List<int> GetAlbumGenres(List<MusicGenre> databaseGenres, List<string> notionGenres)
    {
        var genreIds = new List<int>();

        foreach (var genre in notionGenres)
        {
            var dbGenre = databaseGenres.FirstOrDefault(g => g.Name.ToLower(CultureInfo.InvariantCulture) == genre.ToLower(CultureInfo.InvariantCulture));

            if (dbGenre is not null)
            {
                genreIds.Add(dbGenre.MusicGenreId);
            }
        }
        
        return genreIds;
    }

    static List<int> GetAlbumFormats(List<MusicFormat> databaseFormats, List<string> notionFormats)
    {
        var formatIds = new List<int>();

        foreach (var format in notionFormats)
        {
            var dbFormat = databaseFormats.FirstOrDefault(g => g.Name.ToLower(CultureInfo.InvariantCulture) == format.ToLower(CultureInfo.InvariantCulture));

            if (dbFormat is not null)
            {
                formatIds.Add(dbFormat.MusicFormatId);
            }
        }
        
        return formatIds;
    }
    
    static void WriteConsoleError(string errorMessage)
    {
        WriteWithColor(errorMessage, ConsoleColor.Red);
    }

    static void WriteConsoleSuccess(string successMessage)
    {
        WriteWithColor(successMessage, ConsoleColor.Green);
    }

    static void WriteWithColor(string message, ConsoleColor color)
    {
        Console.ForegroundColor = color;
        Console.WriteLine(message);
        Console.ResetColor();
    }
}
