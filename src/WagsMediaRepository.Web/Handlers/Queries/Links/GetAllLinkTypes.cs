namespace WagsMediaRepository.Web.Handlers.Queries.Links;

public class GetAllLinkTypes
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<LinkTypeApiModel>>> { }

    public class Handler(
        ILinkRepository linkRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<LinkTypeApiModel>>>
    {
        public async Task<OperationResultValue<IReadOnlyCollection<LinkTypeApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var linkTypes = await linkRepository.GetLinkTypesAsync();

                return new OperationResultValue<IReadOnlyCollection<LinkTypeApiModel>>(linkTypes.Select(LinkTypeApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<LinkTypeApiModel>>(e.Message);
            }
        }
    }
}