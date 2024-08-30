using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Podcasts;

public class SavePodcast
{
    public class Request : IRequest<OperationResult>
    {
        public int PodcastId { get; set; }
        
        [Required(ErrorMessage = "Podcast category is required.")]
        public int PodcastCategoryId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Link is required.")]
        public string Link { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Cover image is required.")]
        public string CoverImageUrl { get; set; } = string.Empty;
    }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.PodcastId > 0)
                {
                    await podcastRepository.UpdatePodcastAsync(new Podcast
                    {
                        PodcastId = request.PodcastId,
                        PodcastCategoryId = request.PodcastCategoryId,
                        Name = request.Name,
                        Link = request.Link,
                        CoverImageUrl = request.CoverImageUrl,
                    });
                }
                else
                {
                    await podcastRepository.AddPodcastAsync(new Podcast
                    {
                        PodcastCategoryId = request.PodcastCategoryId,
                        Name = request.Name,
                        Link = request.Link,
                        CoverImageUrl = request.CoverImageUrl,
                    });
                }

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}