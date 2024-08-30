namespace WagsMediaRepository.Domain.Models;

public class BookSeries
{
    public int BookSeriesId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookSeries FromDto(BookSeriesDto dto) => new()
    {
        BookSeriesId = dto.BookSeriesId,
        Name = dto.Name,
        ColorCode = dto.ColorCode,
    };
}