namespace WagsMediaRepository.Web.Handlers.Commands.Links;

public class DeleteLinkType
{
    public class Request : IRequest<OperationResult>
    {
        public int LinkTypeId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            LinkTypeId = id;
        }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                await linkRepository.DeleteLinkTypeAsync(request.LinkTypeId);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}