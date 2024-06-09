using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Links;

public class GetLink
{
    public class Request : IRequest<OperationResultValue<LinkApiModel>>
    {
        public int LinkId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            LinkId = id;
        }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResultValue<LinkApiModel>>
    {
        public async Task<OperationResultValue<LinkApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var link = await linkRepository.GetLinkByIdAsync(request.LinkId);

                if (link is null)
                {
                    throw new ObjectNotFoundException("Unable to find link");
                }

                return new OperationResultValue<LinkApiModel>(LinkApiModel.FromDomainModel(link));
            }
            catch (Exception e)
            {
                return new OperationResultValue<LinkApiModel>(e.Message);
            }
        }
    }
}