namespace WagsMediaRepository.Loader.Models;

public class NotionMusic
{
    public string Album { get; set; } = string.Empty;
    
    public string Artist { get; set; } = string.Empty;
    
    public string CoverUrl { get; set; } = string.Empty;

    public List<string> Formats { get; set; } = [];

    public List<string> Genres { get; set; } = [];
    
    public bool IsTopTen { get; set; }
    
    public bool ShowOnNow { get; set; }
}