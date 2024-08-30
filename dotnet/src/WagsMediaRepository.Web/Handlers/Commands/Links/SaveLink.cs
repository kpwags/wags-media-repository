using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Links;

public class SaveLink
{
    public class Request : IRequest<OperationResult>
    {
        public int LinkId { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "Link type is required")]
        [Required(ErrorMessage = "Link type is required")]
        public int LinkTypeId { get; set; }
    
        [Range(1, int.MaxValue, ErrorMessage = "Link category is required")]
        [Required(ErrorMessage = "Link category is required")]
        public int LinkCategoryId { get; set; }
        
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Author is required.")]
        public string Author { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "URL is required.")]
        public string Url { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Date is required.")]
        public DateTime LinkDate { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "Issue number is required")]
        [Required(ErrorMessage = "Issue number is required")]
        public int ReadingLogIssueNumber { get; set; }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.LinkId > 0)
                {
                    await linkRepository.UpdateLinkAsync(new Link
                    {
                        LinkId = request.LinkId,
                        LinkTypeId = request.LinkTypeId,
                        LinkCategoryId = request.LinkCategoryId,
                        Title = request.Title,
                        Url = request.Url,
                        Author = request.Author,
                        LinkDate = request.LinkDate,
                        ReadingLogIssueNumber = request.ReadingLogIssueNumber,
                    });
                }
                else
                {
                    await linkRepository.AddLinkAsync(new Link
                    {
                        LinkTypeId = request.LinkTypeId,
                        LinkCategoryId = request.LinkCategoryId,
                        Title = request.Title,
                        Url = request.Url,
                        Author = request.Author,
                        LinkDate = request.LinkDate,
                        ReadingLogIssueNumber = request.ReadingLogIssueNumber,
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