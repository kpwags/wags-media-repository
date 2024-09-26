namespace WagsMediaRepository.Domain.Models;

public class BookFormat
{
    public int BookFormatId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookFormat FromDto(BookFormatDto dto) => new()
    {
        BookFormatId = dto.BookFormatId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}