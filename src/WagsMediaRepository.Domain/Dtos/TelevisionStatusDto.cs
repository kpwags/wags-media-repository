namespace WagsMediaRepository.Domain.Dtos;

public class TelevisionStatusDto
{
    public int TelevisionStatusId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<TelevisionShowDto> TelevisionShows { get; set; } = [];
}