namespace WagsMediaRepository.Domain.ApiModels;

public class VideoGameGenreApiModel
{
    public int VideoGameGenreId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static VideoGameGenreApiModel FromDomainModel(VideoGameGenre domainModel) => new()
    {
        VideoGameGenreId = domainModel.VideoGameGenreId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}