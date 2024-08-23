using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Domain.ApiModels;

public class LinkTypeApiModel
{
    public int LinkTypeId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static LinkTypeApiModel FromDomainModel(LinkType domainModel) => new()
    {
        LinkTypeId = domainModel.LinkTypeId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}