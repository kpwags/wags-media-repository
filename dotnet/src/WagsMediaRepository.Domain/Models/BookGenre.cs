namespace WagsMediaRepository.Domain.Models;

public class BookGenre
{
    public int BookGenreId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookGenre FromDto(BookGenreDto dto) => new()
    {
        BookGenreId = dto.BookGenreId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}