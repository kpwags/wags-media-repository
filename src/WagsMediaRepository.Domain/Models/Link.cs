namespace WagsMediaRepository.Domain.Models;

public class Link
{
    public int LinkId { get; set; }
    
    public int LinkTypeId { get; set; }
    
    public int LinkCategoryId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;
    
    public string Author { get; set; } = string.Empty;
    
    public DateTime LinkDate { get; set; }
    
    public int ReadingLogIssueNumber { get; set; }

    public LinkType LinkType { get; set; } = new();
    
    public LinkCategory LinkCategory { get; set; } = new();

    public static Link FromDto(LinkDto dto) => new()
    {
        LinkId = dto.LinkId,
        LinkTypeId = dto.LinkTypeId,
        LinkCategoryId = dto.LinkCategoryId,
        Title = dto.Title,
        Url = dto.Url,
        Author = dto.Author,
        LinkDate = dto.LinkDate,
        ReadingLogIssueNumber = dto.ReadingLogIssueNumber,
        LinkType = LinkType.FromDto(dto.LinkType),
        LinkCategory = LinkCategory.FromDto(dto.LinkCategory),
    };
}