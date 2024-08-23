namespace WagsMediaRepository.Domain.ApiModels;

public class LinkApiModel
{
    public int LinkId { get; set; }
    
    public int LinkTypeId { get; set; }
    
    public int LinkCategoryId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;
    
    public string Author { get; set; } = string.Empty;
    
    public DateTime LinkDate { get; set; }
    
    public int ReadingLogIssueNumber { get; set; }

    public LinkTypeApiModel LinkType { get; set; } = new();
    
    public LinkCategoryApiModel LinkCategory { get; set; } = new();

    public static LinkApiModel FromDomainModel(Link domainModel) => new()
    {
        LinkId = domainModel.LinkId,
        LinkTypeId = domainModel.LinkTypeId,
        LinkCategoryId = domainModel.LinkCategoryId,
        Title = domainModel.Title,
        Url = domainModel.Url,
        Author = domainModel.Author,
        LinkDate = domainModel.LinkDate,
        ReadingLogIssueNumber = domainModel.ReadingLogIssueNumber,
        LinkType = LinkTypeApiModel.FromDomainModel(domainModel.LinkType),
        LinkCategory = LinkCategoryApiModel.FromDomainModel(domainModel.LinkCategory),
    };
}