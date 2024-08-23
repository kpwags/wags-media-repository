using WagsMediaRepository.Domain.Exceptions;

namespace WagsMediaRepository.Web.Handlers.Queries.Links;

public class GetLinkCategory
{
    public class Request : IRequest<OperationResultValue<LinkCategoryApiModel>>
    {
        public int LinkCategoryId { get; set; }
        
        public Request() { }

        public Request(int id)
        {
            LinkCategoryId = id;
        }
    }

    public class Handler(ILinkRepository linkRepository) : IRequestHandler<Request, OperationResultValue<LinkCategoryApiModel>>
    {
        public async Task<OperationResultValue<LinkCategoryApiModel>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var linkCategory = await linkRepository.GetLinkCategoryByIdAsync(request.LinkCategoryId);

                if (linkCategory is null)
                {
                    return new OperationResultValue<LinkCategoryApiModel>("Unable to find link category");
                }

                return new OperationResultValue<LinkCategoryApiModel>(LinkCategoryApiModel.FromDomainModel(linkCategory));
            }
            catch (Exception e)
            {
                return new OperationResultValue<LinkCategoryApiModel>(e.Message);
            }
        }
    }
}