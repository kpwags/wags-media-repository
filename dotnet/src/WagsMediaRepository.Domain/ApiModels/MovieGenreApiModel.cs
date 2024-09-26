namespace WagsMediaRepository.Domain.ApiModels;

public class MovieGenreApiModel
{
    public int MovieGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static MovieGenreApiModel FromDomainModel(MovieGenre domainModel) => new()
    {
        MovieGenreId = domainModel.MovieGenreId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}