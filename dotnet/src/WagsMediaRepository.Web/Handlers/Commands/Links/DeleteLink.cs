namespace WagsMediaRepository.Web.Handlers.Commands.Links;

public class DeleteLink
{
    public class Request : IRequest<OperationResult>
    {
        public int LinkId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            LinkId = id;
        }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await linkRepository.DeleteLinkAsync(request.LinkId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}