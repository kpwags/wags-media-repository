namespace WagsMediaRepository.Domain.ApiModels;

public class TelevisionServiceApiModel
{
    public int TelevisionServiceId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static TelevisionServiceApiModel FromDomainModel(TelevisionService domainModel) => new()
    {
        TelevisionServiceId = domainModel.TelevisionServiceId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}