namespace WagsMediaRepository.Domain.ApiModels;

public class MovieServiceApiModel
{
    public int MovieServiceId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static MovieServiceApiModel FromDomainModel(MovieService domainModel) => new()
    {
        MovieServiceId = domainModel.MovieServiceId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}