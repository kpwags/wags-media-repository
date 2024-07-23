namespace WagsMediaRepository.Domain.ApiModels;

public class MusicFormatApiModel
{
    public int MusicFormatId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static MusicFormatApiModel FromDomainModel(MusicFormat domainModel) => new()
    {
        MusicFormatId = domainModel.MusicFormatId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}