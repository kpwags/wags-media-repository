namespace WagsMediaRepository.Domain.Dtos;

public class TelevisionShowToTelevisionServiceDto
{
    public int TelevisionShowToTelevisionServiceId { get; set; }
    
    public int TelevisionShowId { get; set; }
    
    public int TelevisionServiceId { get; set; }

    public TelevisionShowDto TelevisionShow { get; set; } = new();
    
    public TelevisionServiceDto TelevisionService { get; set; } = new();
}