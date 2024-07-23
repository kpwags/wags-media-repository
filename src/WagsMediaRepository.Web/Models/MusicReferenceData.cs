namespace WagsMediaRepository.Web.Models;

public class MusicReferenceData
{
    public IReadOnlyCollection<MusicGenreApiModel> Genres { get; set; } = [];
    
    public IReadOnlyCollection<MusicFormatApiModel> Formats { get; set; } = [];
}