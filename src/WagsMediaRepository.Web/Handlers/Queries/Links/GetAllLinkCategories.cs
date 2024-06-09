namespace WagsMediaRepository.Web.Handlers.Queries.Links;

public class GetAllLinkCategories
{
    public class Request : IRequest<OperationResultValue<IReadOnlyCollection<LinkCategoryApiModel>>> { }

    public class Handler(
        ILinkRepository linkRepository) : IRequestHandler<Request, OperationResultValue<IReadOnlyCollection<LinkCategoryApiModel>>>
    {
        public async Task<OperationResultValue<IReadOnlyCollection<LinkCategoryApiModel>>> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                var linkCategories = await linkRepository.GetLinkCategoriesAsync();

                return new OperationResultValue<IReadOnlyCollection<LinkCategoryApiModel>>(linkCategories.Select(LinkCategoryApiModel.FromDomainModel).ToList());
            }
            catch (Exception e)
            {
                return new OperationResultValue<IReadOnlyCollection<LinkCategoryApiModel>>(e.Message);
            }
        }
    }
}