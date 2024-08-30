namespace WagsMediaRepository.Domain.Models;

public class LinkType
{
    public int LinkTypeId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static LinkType FromDto(LinkTypeDto dto) => new()
    {
        LinkTypeId = dto.LinkTypeId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}