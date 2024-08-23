namespace WagsMediaRepository.Domain.Models;

public class TelevisionShow
{
    public int TelevisionShowId { get; set; }
    
    public int TelevisionStatusId { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string ImdbLink { get; set; } = string.Empty;
    
    public int Rating { get; set; }

    public string Thoughts { get; set; } = string.Empty;
    
    public string CoverImageUrl { get; set; } = string.Empty;
    
    public int CurrentSeason { get; set; }
    
    public int NumberOfSeasons { get; set; }
    
    public int? SortOrder { get; set; }

    public TelevisionStatus Status { get; set; } = new();

    public List<TelevisionGenre> Genres { get; set; } = [];

    public List<TelevisionService> Services { get; set; } = [];

    public static TelevisionShow FromDto(TelevisionShowDto dto) => new()
    {
        TelevisionShowId = dto.TelevisionShowId,
        TelevisionStatusId = dto.TelevisionStatusId,
        Title = dto.Title,
        ImdbLink = dto.ImdbLink,
        Rating = dto.Rating,
        Thoughts = dto.Thoughts,
        CoverImageUrl = dto.CoverImageUrl,
        CurrentSeason = dto.CurrentSeason,
        NumberOfSeasons = dto.NumberOfSeasons,
        SortOrder = dto.SortOrder,
        Status = TelevisionStatus.FromDto(dto.TelevisionStatus),
        Genres = dto.TelevisionToTelevisionGenres
            .Select(tg => TelevisionGenre.FromDto(tg.TelevisionGenre))
            .ToList(),
        Services = dto.TelevisionToTelevisionServices
            .Select(ts => TelevisionService.FromDto(ts.TelevisionService))
            .ToList(),
    };
}