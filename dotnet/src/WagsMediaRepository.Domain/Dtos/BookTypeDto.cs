namespace WagsMediaRepository.Domain.Dtos;

public class BookTypeDto
{
    public int BookTypeId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<BookDto> Books { get; set; } = [];
}