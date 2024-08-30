using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Domain.ApiModels;

public class LinkCategoryApiModel
{
    public int LinkCategoryId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static LinkCategoryApiModel FromDomainModel(LinkCategory domainModel) => new()
    {
        LinkCategoryId = domainModel.LinkCategoryId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}