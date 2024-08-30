namespace WagsMediaRepository.Domain.ApiModels;

public class VideoGameSystemApiModel
{
    public int VideoGameSystemId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static VideoGameSystemApiModel FromDomainModel(VideoGameSystem domainModel) => new()
    {
        VideoGameSystemId = domainModel.VideoGameSystemId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}