namespace WagsMediaRepository.Domain.Dtos;

public class BookToBookFormatDto
{
    public int BookToBookFormatId { get; set; }
    
    public int BookId { get; set; }
    
    public int BookFormatId { get; set; }

    public BookDto Book { get; set; } = new();
    
    public BookFormatDto BookFormat { get; set; } = new();
}