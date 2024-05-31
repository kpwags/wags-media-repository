namespace WagsMediaRepository.Domain.Dtos;

public class TelevisionServiceDto
{
    public int TelevisionServiceId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<TelevisionShowToTelevisionServiceDto> TelevisionShowToTelevisionServices { get; set; } = [];
}