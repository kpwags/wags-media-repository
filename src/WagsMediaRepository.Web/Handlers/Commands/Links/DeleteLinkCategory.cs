namespace WagsMediaRepository.Web.Handlers.Commands.Links;

public class DeleteLinkCategory
{
    public class Request : IRequest<OperationResult>
    {
        public int LinkCategoryId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            LinkCategoryId = id;
        }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await linkRepository.DeleteLinkCategoryAsync(request.LinkCategoryId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}