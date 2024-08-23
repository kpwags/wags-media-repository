namespace WagsMediaRepository.Domain.Dtos;

public class LinkTypeDto
{
    public int LinkTypeId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<LinkDto> Links { get; set; } = [];
}