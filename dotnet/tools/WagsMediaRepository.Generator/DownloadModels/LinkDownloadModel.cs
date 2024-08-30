using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.Models;

namespace WagsMediaRepository.Generator.DownloadModels;

public class LinkDownloadModel
{
    public int LinkId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;
    
    public string Author { get; set; } = string.Empty;
    
    public DateTime LinkDate { get; set; }
    
    public int ReadingLogIssueNumber { get; set; }

    public Tag Type { get; set; } = new();

    public Tag Category { get; set; } = new();

    public static LinkDownloadModel FromApiModel(LinkApiModel link) => new()
    {
        LinkId = link.LinkId,
        Title = link.Title,
        Url = link.Url,
        Author = link.Author,
        LinkDate = link.LinkDate,
        ReadingLogIssueNumber = link.ReadingLogIssueNumber,
        Type = new Tag(link.LinkType.Name, link.LinkType.ColorCode),
        Category = new Tag(link.LinkCategory.Name, link.LinkCategory.ColorCode),
    };
}