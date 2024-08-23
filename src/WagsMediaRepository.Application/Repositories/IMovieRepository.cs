namespace WagsMediaRepository.Application.Repositories;

public interface IMovieRepository
{
    Task<List<MovieStatus>> GetStatusesAsync();

    Task<MovieGenre?> GetGenreByIdAsync(int genreId);

    Task<List<MovieGenre>> GetGenresAsync();
    
    Task<MovieGenre> AddGenreAsync(MovieGenre genre);
    
    Task<MovieGenre> UpdateGenreAsync(MovieGenre genre);
    
    Task DeleteGenreAsync(int genreId);
    
    Task<MovieService?> GetServiceByIdAsync(int serviceId);

    Task<List<MovieService>> GetServicesAsync();
    
    Task<MovieService> AddServiceAsync(MovieService service);
    
    Task<MovieService> UpdateServiceAsync(MovieService service);
    
    Task DeleteServiceAsync(int serviceId);
    
    Task<Movie?> GetMovieById(int movieId);

    Task<List<Movie>> GetMoviesAsync();

    Task<Movie> AddMovieAsync(Movie movie);
    
    Task<Movie> UpdateMovieAsync(Movie movie);
    
    Task DeleteMovieAsync(int movieId);
}