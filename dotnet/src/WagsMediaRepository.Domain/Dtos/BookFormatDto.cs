namespace WagsMediaRepository.Domain.Dtos;

public class BookFormatDto
{
    public int BookFormatId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public List<BookToBookFormatDto> BookToBookFormats { get; set; } = [];
}