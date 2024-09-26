namespace WagsMediaRepository.Domain.ApiModels;

public class BookFormatApiModel
{
    public int BookFormatId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookFormatApiModel FromDomainModel(BookFormat domainModel) => new()
    {
        BookFormatId = domainModel.BookFormatId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}