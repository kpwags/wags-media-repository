using Microsoft.Extensions.DependencyInjection;
using WagsMediaRepository.Infrastructure.Repositories;

namespace WagsMediaRepository.Web.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<ILinkRepository, LinkRepository>();
        services.AddScoped<IMovieRepository, MovieRepository>();
        services.AddScoped<IPodcastRepository, PodcastRepository>();
        services.AddScoped<ITelevisionRepository, TelevisionRepository>();
        services.AddScoped<IVideoGameRepository, VideoGameRepository>();
        
        return services;
    }
    
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        return services;
    }
}