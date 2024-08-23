using Notion.Client;
using WagsMediaRepository.Loader.Configuration;
using WagsMediaRepository.Loader.Models;

namespace WagsMediaRepository.Loader;

public class NotionService
{
    private readonly NotionClient _notionClient;
    private readonly NotionConfiguration _configuration;

    public NotionService(NotionConfiguration configuration)
    {
        _configuration = configuration;
        _notionClient = NotionClientFactory.Create(new ClientOptions
        {
            AuthToken = configuration.Key,
        });
    }

    public async Task<List<NotionTv>> LoadTelevisionShows()
    {
        var tvShows = new List<NotionTv>();

        bool hasMore;
        string? cursor = null;

        do
        {
            var result = await FetchFromNotion(_configuration.TelevisionDatabase, cursor);

            tvShows.AddRange(MapNotionResultToTv(result.Results));

            hasMore = result.HasMore;
            cursor = result.NextCursor;
        } while (hasMore);

        return tvShows;
    }

    public async Task<List<NotionPodcast>> LoadPodcasts()
    {
        var podcasts = new List<NotionPodcast>();

        bool hasMore;
        string? cursor = null;

        do
        {
            var result = await FetchFromNotion(_configuration.PodcastDatabase, cursor);

            podcasts.AddRange(MapNotionResultsToPodcast(result.Results));

            hasMore = result.HasMore;
            cursor = result.NextCursor;
        } while (hasMore);

        return podcasts;
    }

    public async Task<List<NotionMovie>> LoadMovies()
    {
        var movies = new List<NotionMovie>();

        bool hasMore;
        string? cursor = null;

        do
        {
            var result = await FetchFromNotion(_configuration.MovieDatabase, cursor);

            movies.AddRange(MapNotionResultsToMovie(result.Results));

            hasMore = result.HasMore;
            cursor = result.NextCursor;
        } while (hasMore);

        return movies;
    }

    public async Task<List<NotionLink>> LoadLinks()
    {
        var links = new List<NotionLink>();

        bool hasMore;
        string? cursor = null;

        do
        {
            var result = await FetchFromNotion(_configuration.LinkDatabase, cursor);

            links.AddRange(MapNotionResultsToLink(result.Results));

            hasMore = result.HasMore;
            cursor = result.NextCursor;
        } while (hasMore);

        return links;
    }

    public async Task<List<NotionVideoGame>> LoadVideoGames()
    {
        var videoGames = new List<NotionVideoGame>();

        bool hasMore;
        string? cursor = null;

        do
        {
            var result = await FetchFromNotion(_configuration.VideoGameDatabase, cursor);

            videoGames.AddRange(MapNotionResultsToVideoGame(result.Results));

            hasMore = result.HasMore;
            cursor = result.NextCursor;
        } while (hasMore);

        return videoGames;
    }

    public async Task<List<NotionBook>> LoadBooks()
    {
        var books = new List<NotionBook>();

        bool hasMore;
        string? cursor = null;

        do
        {
            var result = await FetchFromNotion(_configuration.BookDatabase, cursor);

            books.AddRange(MapNotionResultsToBooks(result.Results));

            hasMore = result.HasMore;
            cursor = result.NextCursor;
        } while (hasMore);

        return books;
    }
    
    public async Task<List<NotionMusic>> LoadMusic()
    {
        var music = new List<NotionMusic>();

        bool hasMore;
        string? cursor = null;

        do
        {
            var result = await FetchFromNotion(_configuration.MusicDatabase, cursor);

            music.AddRange(MapNotionResultsToMusic(result.Results));

            hasMore = result.HasMore;
            cursor = result.NextCursor;
        } while (hasMore);

        return music;
    }
    
    private async Task<PaginatedList<Page>> FetchFromNotion(string dbId, string? cursor)
    {
        var queryParams = new DatabasesQueryParameters
        {
            StartCursor = cursor
        };
        
        return await _notionClient.Databases.QueryAsync(dbId, queryParams);
    }

    private List<NotionTv> MapNotionResultToTv(List<Page> results)
    {
        var tvShows = new List<NotionTv>();

        foreach (var page in results)
        {
            tvShows.Add(MapNotionResultToTv(page));
        }
        
        return tvShows;
    }

    private NotionTv MapNotionResultToTv(Page result)
    {
        var title = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "name");
        var coverUrl = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "coverurl");
        var services = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "service(s)");
        var link = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "link");
        var rating = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "rating");
        var thoughts = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "thoughts");
        var status = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "status");
        
        return new NotionTv
        {
            Title = GetStringValue((TitlePropertyValue)title.Value),
            CoverUrl = GetStringValue((UrlPropertyValue)coverUrl.Value),
            Service = string.Join(',', GetStringValue((MultiSelectPropertyValue)services.Value)),
            Link = GetStringValue((UrlPropertyValue)link.Value),
            Thoughts = GetStringValue((RichTextPropertyValue)thoughts.Value),
            Rating = GetNumericValue((NumberPropertyValue)rating.Value),
            Status = GetStringValue((SelectPropertyValue)status.Value),
        };
    }

    private List<NotionPodcast> MapNotionResultsToPodcast(List<Page> results)
    {
        var podcasts = new List<NotionPodcast>();

        foreach (var page in results)
        {
            podcasts.Add(MapNotionResultToPodcast(page));
        }
        
        return podcasts;
    }

    private NotionPodcast MapNotionResultToPodcast(Page result)
    {
        var name = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "name");
        var category = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "category");
        var coverUrl = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "artworkurl");
        var link = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "link");
        
        return new NotionPodcast
        {
            Name = GetStringValue((TitlePropertyValue)name.Value),
            ImageUrl = GetStringValue((UrlPropertyValue)coverUrl.Value),
            Link = GetStringValue((UrlPropertyValue)link.Value),
            Category = GetStringValue((SelectPropertyValue)category.Value),
        };
    }

    private List<NotionMovie> MapNotionResultsToMovie(List<Page> results)
    {
        var movies = new List<NotionMovie>();

        foreach (var page in results)
        {
            movies.Add(MapNotionResultToMovie(page));
        }
        
        return movies;
    }

    private NotionMovie MapNotionResultToMovie(Page result)
    {
        var title = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "name");
        var coverUrl = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "coverurl");
        var services = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "service(s)");
        var genres = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "tags");
        var link = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "imdblink");
        var rating = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "rating");
        var thoughts = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "thoughts");
        var status = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "status");
        var dateWatched = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "datewatched");
        
        return new NotionMovie
        {
            Title = GetStringValue((TitlePropertyValue)title.Value),
            CoverUrl = GetStringValue((UrlPropertyValue)coverUrl.Value),
            Services = string.Join(',', GetStringValue((MultiSelectPropertyValue)services.Value)),
            Genres = string.Join(',', GetStringValue((MultiSelectPropertyValue)genres.Value)),
            ImdbLink = GetStringValue((UrlPropertyValue)link.Value),
            Thoughts = GetStringValue((RichTextPropertyValue)thoughts.Value),
            Rating = GetNumericValue((NumberPropertyValue)rating.Value),
            Status = GetStringValue((SelectPropertyValue)status.Value),
            DateWatched = GetDateWatched((DatePropertyValue)dateWatched.Value) is not null ? GetDateWatched((DatePropertyValue)dateWatched.Value)?.Start : null, 
        };
    }
    
    private List<NotionLink> MapNotionResultsToLink(List<Page> results)
    {
        var links = new List<NotionLink>();

        foreach (var page in results)
        {
            links.Add(MapNotionResultToLink(page));
        }
        
        return links;
    }

    private NotionLink MapNotionResultToLink(Page result)
    {
        var title = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "title");
        var link = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "link");
        var author = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "author");
        var linkType = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "type");
        var category = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "category");
        var dateWatched = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "date");
        var issue = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "issue");
        
        return new NotionLink
        {
            Title = GetStringValue((TitlePropertyValue)title.Value),
            Link = GetStringValue((UrlPropertyValue)link.Value),
            Author = GetStringValue((RichTextPropertyValue)author.Value),
            Type = GetStringValue((SelectPropertyValue)linkType.Value),
            Category = GetStringValue((SelectPropertyValue)category.Value),
            DateRead = GetDateWatched((DatePropertyValue)dateWatched.Value)?.Start ?? DateTime.Now, 
            Issue = GetNumericValue((NumberPropertyValue)issue.Value),
        };
    }

    private List<NotionVideoGame> MapNotionResultsToVideoGame(List<Page> results)
    {
        var videoGames = new List<NotionVideoGame>();

        foreach (var page in results)
        {
            videoGames.Add(MapNotionResultToVideoGame(page));
        }
        
        return videoGames;
    }

    private NotionVideoGame MapNotionResultToVideoGame(Page result)
    {
        var title = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "name");
        var completionStatus = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "completed");
        var link = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "link");
        var coverUrl = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "coverurl");
        var dateStarted = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "date started");
        var dateCompleted = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "date completed");
        var platform = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "platform");
        var rating = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "rating");
        var thoughts = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "thoughts");
        var status = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "status");
        
        return new NotionVideoGame
        {
            Title = GetStringValue((TitlePropertyValue)title.Value),
            CompletionStatus = GetStringValue((SelectPropertyValue)completionStatus.Value),
            Link = GetStringValue((UrlPropertyValue)link.Value),
            CoverUrl = GetStringValue((UrlPropertyValue)coverUrl.Value),
            DateStarted = GetDateWatched((DatePropertyValue)dateStarted.Value) is not null ? GetDateWatched((DatePropertyValue)dateStarted.Value)?.Start : null,
            DateCompleted = GetDateWatched((DatePropertyValue)dateCompleted.Value) is not null ? GetDateWatched((DatePropertyValue)dateCompleted.Value)?.Start : null,
            Platforms = GetStringValue((SelectPropertyValue)platform.Value),
            Thoughts = GetStringValue((RichTextPropertyValue)thoughts.Value),
            Rating = GetNumericValue((NumberPropertyValue)rating.Value),
            Status = GetStringValue((SelectPropertyValue)status.Value),
        };
    }
    
    private List<NotionBook> MapNotionResultsToBooks(List<Page> results)
    {
        var books = new List<NotionBook>();

        foreach (var page in results)
        {
            books.Add(MapNotionResultToBook(page));
        }
        
        return books;
    }

    private NotionBook MapNotionResultToBook(Page result)
    {
        var title = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "name");
        var subtitle = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "subtitle");
        var author = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "author");
        var type = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "type");
        var status = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "status");
        var link = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "link");
        var bookReviewUrl = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "reviewurlslug");
        var medium = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "medium");
        var coverUrl = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "coverurl");
        var rating = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "rating");
        var thoughts = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "thoughts");
        var currentPage = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "current page");
        var pageCount = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "page count");
        var purchased = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "purchased");
        var libraryHasIt = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "library has it");
        var dateStarted = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "datestarted");
        var dateCompleted = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "datefinished");
        var backlogId = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "backlog id");
        
        return new NotionBook
        {
            BacklogId = GetNumericValue((NumberPropertyValue)backlogId.Value),
            Title = GetStringValue((TitlePropertyValue)title.Value),
            Subtitle = GetStringValue((RichTextPropertyValue)subtitle.Value),
            Author = GetStringValue((RichTextPropertyValue)author.Value),
            Type = GetStringValue((SelectPropertyValue)type.Value),
            Status = GetStringValue((SelectPropertyValue)status.Value),
            Link = GetStringValue((UrlPropertyValue)link.Value),
            BookReviewUrl = GetStringValue((RichTextPropertyValue)bookReviewUrl.Value),
            Medium = GetStringValue((SelectPropertyValue)medium.Value),
            CoverUrl = GetStringValue((UrlPropertyValue)coverUrl.Value),
            Rating = GetNumericValue((NumberPropertyValue)rating.Value),
            Thoughts = GetStringValue((RichTextPropertyValue)thoughts.Value),
            CurrentPage = GetNumericValue((NumberPropertyValue)currentPage.Value),
            PageCount = GetNumericValue((NumberPropertyValue)pageCount.Value),
            Purchased = GetCheckboxValue((CheckboxPropertyValue)purchased.Value),
            LibraryHasIt = GetCheckboxValue((CheckboxPropertyValue)libraryHasIt.Value),
            DateStarted = GetDateWatched((DatePropertyValue)dateStarted.Value) is not null ? GetDateWatched((DatePropertyValue)dateStarted.Value)?.Start : null,
            DateCompleted = GetDateWatched((DatePropertyValue)dateCompleted.Value) is not null ? GetDateWatched((DatePropertyValue)dateCompleted.Value)?.Start : null,
        };
    }
    
    private List<NotionMusic> MapNotionResultsToMusic(List<Page> results)
    {
        var music = new List<NotionMusic>();

        foreach (var page in results)
        {
            music.Add(MapNotionResultToMusicAlbum(page));
        }
        
        return music;
    }

    private NotionMusic MapNotionResultToMusicAlbum(Page result)
    {
        var name = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "album");
        var artist = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "artist");
        var coverUrl = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "coverurl");
        var formats = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "format");
        var genres = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "genre");
        var showOnNow = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "showonnow");
        var top10 = result.Properties.FirstOrDefault(p => p.Key.ToLower() == "top10");
        
        return new NotionMusic
        {
            Album = GetStringValue((TitlePropertyValue)name.Value),
            Artist = GetStringValue((RichTextPropertyValue)artist.Value),
            CoverUrl = GetStringValue((UrlPropertyValue)coverUrl.Value),
            Formats = GetStringValue((MultiSelectPropertyValue)formats.Value),
            Genres = GetStringValue((MultiSelectPropertyValue)genres.Value),
            ShowOnNow = GetCheckboxValue((CheckboxPropertyValue)showOnNow.Value),
            IsTopTen = GetCheckboxValue((CheckboxPropertyValue)top10.Value),
        };
    }
    
    public string GetStringValue(TitlePropertyValue value) => value?.Title?.FirstOrDefault()?.PlainText.Trim() ?? "";
    
    public string GetStringValue(RichTextPropertyValue value) => value?.RichText?.FirstOrDefault()?.PlainText.Trim() ?? "";

    public string GetStringValue(UrlPropertyValue value) => value?.Url?.Trim() ?? "";
    
    public int GetNumericValue(NumberPropertyValue value) => (int)(value.Number ?? 0.0);
    
    public bool GetCheckboxValue(CheckboxPropertyValue value) => value.Checkbox;
    
    public List<string> GetStringValue(MultiSelectPropertyValue? values)
    {
        if (values is null) return [];
        
        var stringValues = new List<string>();

        foreach (var value in values.MultiSelect)
        {
            stringValues.Add(value?.Name?.Trim() ?? "");
        }
        
        return stringValues;
    }

    public string GetStringValue(SelectPropertyValue value) => value?.Select?.Name.Trim() ?? "";

    public Date? GetDateWatched(DatePropertyValue value) => value?.Date;
}