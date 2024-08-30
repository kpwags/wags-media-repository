namespace WagsMediaRepository.Domain.Models;

public class MusicAlbum
{
    public int MusicAlbumId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Artist { get; set; } = string.Empty;

    public string Thoughts { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
    
    public bool IsTopTen { get; set; }
    
    public bool ShowOnNowPage { get; set; }

    public List<MusicGenre> Genres { get; set; } = [];

    public List<MusicFormat> Formats { get; set; } = [];

    public List<MusicAlbumTrack> Tracks { get; set; } = [];

    public static MusicAlbum FromDto(MusicAlbumDto dto) => new()
    {
        MusicAlbumId = dto.MusicAlbumId,
        Title = dto.Title,
        Artist = dto.Artist,
        Thoughts = dto.Thoughts,
        CoverImageUrl = dto.CoverImageUrl,
        IsTopTen = dto.IsTopTen,
        ShowOnNowPage = dto.ShowOnNowPage,
        Genres = dto.MusicAlbumToMusicGenres
            .Select(g => MusicGenre.FromDto(g.MusicGenre))
            .ToList(),
        Formats = dto.MusicAlbumToMusicFormats
            .Select(f => MusicFormat.FromDto(f.MusicFormat))
            .ToList(),
        Tracks = dto.MusicAlbumTracks
            .OrderBy(t => t.TrackNumber)
            .Select(MusicAlbumTrack.FromDto)
            .ToList(),
    };
}