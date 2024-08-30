namespace WagsMediaRepository.Domain.Dtos;

public class BookGenreDto
{
    public int BookGenreId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public List<BookToBookGenreDto> BookToBookGenres { get; set; } = [];
}