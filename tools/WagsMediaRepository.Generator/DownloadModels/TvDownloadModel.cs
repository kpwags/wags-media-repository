using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.Models;

namespace WagsMediaRepository.Generator.DownloadModels;

public class TvDownloadModel
{
    public int TelevisionShowId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string ImdbLink { get; set; } = string.Empty;
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int CurrentSeason { get; set; }
    
    public int NumberOfSeasons { get; set; }
    
    public int? SortOrder { get; set; }

    public Tag Status { get; set; } = new();

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];

    public IReadOnlyCollection<Tag> Services { get; set; } = [];

    public static TvDownloadModel FromApiModel(TelevisionShowApiModel tv) => new()
    {
        TelevisionShowId = tv.TelevisionShowId,
        Title = tv.Title,
        ImdbLink = tv.ImdbLink,
        Rating = tv.Rating,
        Thoughts = tv.Thoughts,
        CoverImageUrl = tv.CoverImageUrl,
        CurrentSeason = tv.CurrentSeason,
        NumberOfSeasons = tv.NumberOfSeasons,
        SortOrder = tv.SortOrder,
        Status = new Tag(tv.Status.Name, tv.Status.ColorCode),
        Genres = tv.Genres.Select(g => new Tag(g.Name, g.ColorCode)).ToList(),
        Services = tv.Services.Select(s => new Tag(s.Name, s.ColorCode)).ToList(),
    };
}