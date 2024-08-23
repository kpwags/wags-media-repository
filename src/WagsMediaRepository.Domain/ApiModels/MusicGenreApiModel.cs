namespace WagsMediaRepository.Domain.ApiModels;

public class MusicGenreApiModel
{
    public int MusicGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static MusicGenreApiModel FromDomainModel(MusicGenre domainModel) => new()
    {
        MusicGenreId = domainModel.MusicGenreId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}