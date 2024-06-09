namespace WagsMediaRepository.Application.Repositories;

public interface ILinkRepository
{
    Task<List<LinkType>> GetLinkTypesAsync();
    
    Task<LinkType?> GetLinkTypeByIdAsync(int linkTypeId);
    
    Task<LinkType> AddLinkTypeAsync(LinkType linkType);
    
    Task<LinkType> UpdateLinkTypeAsync(LinkType linkType);

    Task DeleteLinkTypeAsync(int linkTypeId);
    
    Task<List<LinkCategory>> GetLinkCategoriesAsync();
    
    Task<LinkCategory?> GetLinkCategoryByIdAsync(int linkCategoryId);
    
    Task<LinkCategory> AddLinkCategoryAsync(LinkCategory linkCategory);
    
    Task<LinkCategory> UpdateLinkCategoryAsync(LinkCategory linkCategory);

    Task DeleteLinkCategoryAsync(int linkCategoryId);

    Task<List<Link>> GetLinksAsync();
    
    Task<Link?> GetLinkByIdAsync(int linkId);
    
    Task<Link> AddLinkAsync(Link link);
    
    Task<Link> UpdateLinkAsync(Link link);

    Task DeleteLinkAsync(int linkId);
}