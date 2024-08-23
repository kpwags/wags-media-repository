using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Podcasts;

public class SavePodcastCategory
{
    public class Request : IRequest<OperationResult>
    {
        public int PodcastCategoryId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(int id, string name, string color)
        {
            PodcastCategoryId = id;
            Name = name;
            ColorCode = color;
        }
    }

    public class Handler(IPodcastRepository podcastRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.PodcastCategoryId > 0)
                {
                    await podcastRepository.UpdatePodcastCategoryAsync(new PodcastCategory
                    {
                        PodcastCategoryId = request.PodcastCategoryId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await podcastRepository.AddPodcastCategoryAsync(new PodcastCategory
                    {
                        Name = request.Name,
                        ColorCode = request.ColorCode,
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