namespace WagsMediaRepository.Domain.Models;

public class BookStatus
{
    public int BookStatusId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static BookStatus FromDto(BookStatusDto dto) => new()
    {
        BookStatusId = dto.BookStatusId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}