namespace WagsMediaRepository.Application.Repositories;

public interface IVideoGameRepository
{
    Task<VideoGame?> GetVideoGameByIdAsync(int videoGameId);

    Task<List<VideoGame>> GetAllVideoGamesAsync();

    Task<VideoGame> AddVideoGameAsync(VideoGame videoGame);

    Task<VideoGame> UpdateVideoGameAsync(VideoGame videoGame);

    Task<VideoGameSystem?> GetVideoGameSystemByIdAsync(int videoGameSystemId);
    
    Task<List<VideoGameSystem>> GetAllVideoGameSystemsAsync();

    Task<VideoGameSystem> AddVideoGameSystemAsync(VideoGameSystem videoGameSystem);

    Task<VideoGameSystem> UpdateVideoGameSystemAsync(VideoGameSystem videoGameSystem);

    Task DeleteVideoGameSystemAsync(int videoGameSystemId);
    
    Task<VideoGameGenre?> GetVideoGameGenreByIdAsync(int videoGameGenreId);
    
    Task<List<VideoGameGenre>> GetAllVideoGameGenresAsync();

    Task<VideoGameGenre> AddVideoGameGenreAsync(VideoGameGenre videoGameGenre);

    Task<VideoGameGenre> UpdateVideoGameGenreAsync(VideoGameGenre videoGameGenre);

    Task DeleteVideoGameGenreAsync(int videoGameGenreId);
}