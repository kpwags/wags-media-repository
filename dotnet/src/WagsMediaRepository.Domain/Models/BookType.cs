namespace WagsMediaRepository.Domain.Models;

public class BookType
{
    public int BookTypeId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookType FromDto(BookTypeDto dto) => new()
    {
        BookTypeId = dto.BookTypeId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}