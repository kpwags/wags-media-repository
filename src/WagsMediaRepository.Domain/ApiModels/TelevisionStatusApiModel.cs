namespace WagsMediaRepository.Domain.ApiModels;

public class TelevisionStatusApiModel
{
    public int TelevisionStatusId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static TelevisionStatusApiModel FromDomainModel(TelevisionStatus domainModel) => new()
    {
        TelevisionStatusId = domainModel.TelevisionStatusId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}