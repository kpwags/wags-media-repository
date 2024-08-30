namespace WagsMediaRepository.Loader.Models;

public class NotionLink
{
    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;
    
    public string Link { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;
    
    public DateTime DateRead { get; set; }
    
    public int Issue { get; set; }
}