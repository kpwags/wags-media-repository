namespace WagsMediaGenerator.Models;

public class MusicAlbum
{
    public int MusicAlbumId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Artist { get; set; } = string.Empty;

    public string Thoughts { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
    
    public bool IsTopTen { get; set; }
    
    public bool ShowOnNowPage { get; set; }

    public IReadOnlyCollection<Tag> Genres { get; set; } = [];

    public IReadOnlyCollection<Tag> Formats { get; set; } = [];

    public IReadOnlyCollection<AlbumTrack> Tracks { get; set; } = [];
}