namespace WagsMediaRepository.Domain.ApiModels;

public class TelevisionGenreApiModel
{
    public int TelevisionGenreId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static TelevisionGenreApiModel FromDomainModel(TelevisionGenre domainModel) => new()
    {
        TelevisionGenreId = domainModel.TelevisionGenreId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}