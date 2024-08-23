namespace WagsMediaRepository.Domain.ApiModels;

public class MovieStatusApiModel
{
    public int MovieStatusId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static MovieStatusApiModel FromDomainModel(MovieStatus domainModel) => new()
    {
        MovieStatusId = domainModel.MovieStatusId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}