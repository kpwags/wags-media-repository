using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Links;

public class GetLinkType
{
    public class Request : IRequest<OperationResultValue<LinkTypeApiModel>>
    {
        public int LinkTypeId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            LinkTypeId = id;
        }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResultValue<LinkTypeApiModel>>
    {
        public async Task<OperationResultValue<LinkTypeApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var linkType = await linkRepository.GetLinkTypeByIdAsync(request.LinkTypeId);

                if (linkType is null)
                {
                    throw new ObjectNotFoundException("Unable to find link type");
                }

                return new OperationResultValue<LinkTypeApiModel>(LinkTypeApiModel.FromDomainModel(linkType));
            }
            catch (Exception e)
            {
                return new OperationResultValue<LinkTypeApiModel>(e.Message);
            }
        }
    }
}