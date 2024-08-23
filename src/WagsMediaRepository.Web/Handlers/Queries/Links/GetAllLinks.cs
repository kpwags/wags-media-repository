namespace WagsMediaRepository.Web.Handlers.Queries.Links;

public class GetAllLinks
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<LinkApiModel>>> { }

    public class Handler(
        ILinkRepository linkRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<LinkApiModel>>>
    {
        public async Task<OperationResultValue<IReadOnlyCollection<LinkApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var links = await linkRepository.GetLinksAsync();

                return new OperationResultValue<IReadOnlyCollection<LinkApiModel>>(links.Select(LinkApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<LinkApiModel>>(e.Message);
            }
        }
    }
}