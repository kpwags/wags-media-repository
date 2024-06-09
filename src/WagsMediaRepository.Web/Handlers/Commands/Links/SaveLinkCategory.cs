using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Links;

public class SaveLinkCategory
{
    public class Request : IRequest<OperationResult>
    {
        [Required(ErrorMessage = "ID is required.")]
        public int LinkCategoryId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(int id, string name, string color)
        {
            LinkCategoryId = id;
            Name = name;
            ColorCode = color;
        }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.LinkCategoryId > 0)
                {
                    await linkRepository.UpdateLinkCategoryAsync(new LinkCategory
                    {
                        LinkCategoryId = request.LinkCategoryId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await linkRepository.AddLinkCategoryAsync(new LinkCategory
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