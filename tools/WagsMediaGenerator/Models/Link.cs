namespace WagsMediaGenerator.Models;

public class Link
{
    public int LinkId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;
    
    public string Author { get; set; } = string.Empty;
    
    public DateTime LinkDate { get; set; }
    
    public int ReadingLogIssueNumber { get; set; }

    public Tag Type { get; set; } = new();

    public Tag Category { get; set; } = new();
}