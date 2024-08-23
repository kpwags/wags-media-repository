namespace WagsMediaRepository.Domain.Models;

public class LinkCategory
{
    public int LinkCategoryId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static LinkCategory FromDto(LinkCategoryDto dto) => new()
    {
        LinkCategoryId = dto.LinkCategoryId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}