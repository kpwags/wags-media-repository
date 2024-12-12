namespace WagsMediaGenerator.Models;

public class BookOutput
{
    public string Year { get; set; } = string.Empty;

    public List<Book> Books { get; set; } = [];
}