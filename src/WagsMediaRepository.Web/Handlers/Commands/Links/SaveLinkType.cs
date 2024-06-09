using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Links;

public class SaveLinkType
{
    public class Request : IRequest<OperationResult>
    {
        public int LinkTypeId { get; set; }
        
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;

        public string ColorCode { get; set; } = string.Empty;
        
        public Request() { }

        public Request(string name, string color)
        {
            Name = name;
            ColorCode = color;
        }

        public Request(int id, string name, string color)
        {
            LinkTypeId = id;
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
                if (request.LinkTypeId > 0)
                {
                    
                    await linkRepository.UpdateLinkTypeAsync(new LinkType
                    {
                        LinkTypeId = request.LinkTypeId,
                        Name = request.Name,
                        ColorCode = request.ColorCode,
                    });
                }
                else
                {
                    await linkRepository.AddLinkTypeAsync(new LinkType
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