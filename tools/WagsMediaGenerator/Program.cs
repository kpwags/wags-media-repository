using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using WagsMediaGenerator.Configuration;
using WagsMediaGenerator.Models;

namespace WagsMediaGenerator;

internal class Program
{
    private static DirectoryConfiguration? _configuration;
    private static GeneralConfiguration? _generalConfiguration;

    static async Task Main()
    {
        var appVersion = System.Reflection.Assembly.GetEntryAssembly()?.GetName().Version;

        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();

        _configuration = config.GetRequiredSection("Directory").Get<DirectoryConfiguration>();
        _generalConfiguration = config.GetRequiredSection("General").Get<GeneralConfiguration>();

        if (_configuration is null || _generalConfiguration is null)
        {
            WriteConsoleError("Unable to read settings");
            return;
        }

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

        var books = await Fetch<Book>("book");

        if (books is null)
        {
            WriteConsoleError("Error retrieving book data");
            return;
        }

        var toRead = books
            .Where(b => b.Status.Name == Constants.BookStatus.ToRead)
            .OrderBy(b => b.SortOrder)
            .ToList();
        var currentlyReading = books
            .Where(b => b.Status.Name == Constants.BookStatus.Reading)
            .ToList();
        var completed = books
            .Where(b => b.Status.Name == Constants.BookStatus.Finished)
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

        var response = await Fetch<Link>("link");

        if (response is null)
        {
            WriteConsoleError("Error retrieving link data");
            return;
        }

        var links = response.ToList();

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

        var videoGames = await Fetch<VideoGame>("video-game");

        if (videoGames is null)
        {
            WriteConsoleError("Error retrieving video game data");
            return;
        }

        var toPlay = videoGames
            .Where(vg => vg.Status.Name == Constants.VideoGameStatus.ToPlay)
            .OrderBy(vg => vg.SortOrder)
            .ToList();
        var currentlyPlaying = videoGames
            .Where(vg => vg.Status.Name == Constants.VideoGameStatus.InProgress)
            .ToList();
        var completed = videoGames
            .Where(vg => vg.Status.Name == Constants.VideoGameStatus.Finished)
            .OrderByDescending(vg => vg.DateCompleted)
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

        if (_generalConfiguration is null)
        {
            WriteConsoleError("Error reading configuration");
            return;
        }

        var movies = await Fetch<Movie>("movie");

        if (movies is null)
        {
            WriteConsoleError("Error retrieving movie data");
            return;
        }

        var toWatch = movies
            .Where(m => m.Status.Name == Constants.MovieStatus.JointList || m.Status.Name == Constants.MovieStatus.PersonalList)
            .OrderBy(m => m.SortOrder)
            .ToList();
        var finished = movies
            .Where(m => m.Status.Name == Constants.MovieStatus.Watched)
            .OrderByDescending(m => m.DateWatched)
            .ToList();
        var abandoned = movies
            .Where(m => m.Status.Name == Constants.MovieStatus.CouldNotFinish)
            .OrderByDescending(m => m.DateWatched)
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

        // movies in the last X days
        var recentMovies = finished
            .Where(m => m.DateWatched?.Date > DateTime.Now.AddDays(_generalConfiguration.MovieDateRange * -1).Date)
            .ToList();

        json = JsonSerializer.Serialize(
            recentMovies,
            options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            }
        );

        await WriteJsonToFile(json, "recentMovies.json");
    }

    static async Task ProcessTelevision()
    {
        WriteWithColor("Writing TV to JSON");

        var tvShows = await Fetch<TelevisionShow>("tv");

        if (tvShows is null)
        {
            WriteConsoleError("Error retrieving TV data");
            return;
        }

        var toWatch = tvShows
            .Where(t => t.Status.Name == Constants.TelevisionStatus.JointList || t.Status.Name == Constants.TelevisionStatus.PersonalList)
            .OrderBy(m => m.SortOrder)
            .ToList();
        var inProgress = tvShows
            .Where(t => t.Status.Name == Constants.TelevisionStatus.Watching)
            .OrderBy(t => SortByTitle(t.Title))
            .ToList();
        var betweenSeasons = tvShows
            .Where(t => t.Status.Name == Constants.TelevisionStatus.InBetweenSeasons)
            .OrderBy(t => SortByTitle(t.Title))
            .ToList();
        var completed = tvShows
            .Where(t => t.Status.Name == Constants.TelevisionStatus.Watched)
            .OrderBy(t => SortByTitle(t.Title))
            .ToList();
        var abandoned = tvShows
            .Where(t => t.Status.Name == Constants.TelevisionStatus.CouldNotFinish)
            .OrderBy(t => SortByTitle(t.Title))
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

        var podcastsTask = Fetch<Podcast>("podcast");
        var podcastCategoriesTask = Fetch<PodcastCategory>("podcast/category");

        await Task.WhenAll(podcastCategoriesTask, podcastsTask);


        var categories = podcastCategoriesTask.Result;
        var podcasts = podcastsTask.Result;

        if (podcasts is null || categories is null)
        {
            WriteConsoleError("Error retrieving podcast data");
            return;
        }

        var podcastOutput = new List<PodcastOutput>();

        foreach (var category in categories)
        {
            podcastOutput.Add(new PodcastOutput
            {
                Name = category.Name,
                Podcasts = podcasts
                    .Where(p => p.PodcastCategoryId == category.PodcastCategoryId)
                    .OrderBy(p => SortByTitle(p.Name))
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

        var albums = await Fetch<MusicAlbum>("music");

        if (albums is null)
        {
            WriteConsoleError("Error retrieving music data");
            return;
        }

        var json = JsonSerializer.Serialize(
            albums.OrderBy(a => SortByTitle(a.Artist)).ThenBy(a => SortByTitle(a.Title)).ToList(),
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

    static HttpClient BuildClient()
    {
        var handler = new HttpClientHandler();
        handler.ClientCertificateOptions = ClientCertificateOption.Manual;
        handler.ServerCertificateCustomValidationCallback =
            (httpRequestMessage, cert, cetChain, policyErrors) =>
            {
                return true;
            };

        return new HttpClient(handler);
    }

    static async Task<IReadOnlyCollection<T>?> Fetch<T>(string url)
    {
        if (_generalConfiguration is null)
        {
            WriteConsoleError("Error reading configuration");
            return null;
        }

        var client = BuildClient();

        var response =
            await client.GetFromJsonAsync<IReadOnlyCollection<T>>(
                $"{_generalConfiguration.ApiRootUrl}/{url}",
                new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,

                });

        return response;
    }

    static string SortByTitle(string title) =>
        title.StartsWith("A ", StringComparison.OrdinalIgnoreCase) || title.StartsWith("The ", StringComparison.OrdinalIgnoreCase)
            ? title.Substring(title.IndexOf(" ", StringComparison.Ordinal) + 1)
            : title;
}