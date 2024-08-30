namespace WagsMediaRepository.Application.Repositories;

public interface ITelevisionRepository
{
    Task<List<TelevisionStatus>> GetStatusesAsync();

    Task<TelevisionService?> GetServiceByIdAsync(int serviceId);

    Task<List<TelevisionService>> GetServicesAsync();

    Task<TelevisionService> AddServiceAsync(TelevisionService service);

    Task<TelevisionService> UpdateServiceAsync(TelevisionService service);

    Task DeleteServiceAsync(int serviceId);

    Task<TelevisionGenre?> GetGenreByIdAsync(int genreId);

    Task<List<TelevisionGenre>> GetGenresAsync();

    Task<TelevisionGenre> AddGenreAsync(TelevisionGenre genre);

    Task<TelevisionGenre> UpdateGenreAsync(TelevisionGenre genre);

    Task DeleteGenreAsync(int genreId);

    Task<TelevisionShow?> GetTelevisionShowByIdAsync(int showId);

    Task<List<TelevisionShow>> GetTelevisionShowsAsync();

    Task<TelevisionShow> AddTelevisionShowAsync(TelevisionShow show);

    Task<TelevisionShow> UpdateTelevisionShowAsync(TelevisionShow show);

    Task DeleteTelevisionShowAsync(int showId);

}