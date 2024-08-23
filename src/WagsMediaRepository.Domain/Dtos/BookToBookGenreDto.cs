namespace WagsMediaRepository.Domain.Dtos;

public class BookToBookGenreDto
{
    public int BookToBookGenreId { get; set; }
    
    public int BookId { get; set; }
    
    public int BookGenreId { get; set; }

    public BookDto Book { get; set; } = new();
    
    public BookGenreDto BookGenre { get; set; } = new();
}