namespace WagsMediaRepository.Application.Repositories;

public interface IMusicRepository
{
    #region Reference

    Task<List<MusicFormat>> GetFormatsAsync();

    #endregion Reference
    
    #region Genres

    Task<MusicGenre?> GetGenreByIdAsync(int genreId);

    Task<List<MusicGenre>> GetGenresAsync();

    Task<MusicGenre> AddGenreAsync(MusicGenre genre);

    Task<MusicGenre> UpdateGenreAsync(MusicGenre genre);

    Task DeleteGenreAsync(int genreId);

    #endregion Genres
    
    #region Tracks
    
    Task<MusicAlbumTrack?> GetTrackByIdAsync(int trackId);

    Task<List<MusicAlbumTrack>> GetTracksForAlbumAsync(int albumId);

    Task<MusicAlbumTrack> AddTrackAsync(MusicAlbumTrack track);

    Task AddTracksAsync(int albumId, List<MusicAlbumTrack> tracks);

    Task<MusicAlbumTrack> UpdateTrackAsync(MusicAlbumTrack track);

    Task UpdateTracksAsync(int albumId, List<MusicAlbumTrack> tracks);

    Task DeleteTrackAsync(int trackId);
    
    #endregion Tracks
    
    #region Albums

    Task<MusicAlbum?> GetAlbumByIdAsync(int albumId);

    Task<List<MusicAlbum>> GetAlbumsAsync();

    Task<MusicAlbum> AddAlbumAsync(MusicAlbum album);

    Task<MusicAlbum> UpdateAlbumAsync(MusicAlbum album);

    Task DeleteAlbumAsync(int albumId);

    #endregion Albums
}