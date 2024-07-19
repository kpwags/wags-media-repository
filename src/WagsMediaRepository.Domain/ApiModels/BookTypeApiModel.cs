namespace WagsMediaRepository.Domain.ApiModels;

public class BookTypeApiModel
{
    public int BookTypeId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookTypeApiModel FromDomainModel(BookType domainModel) => new()
    {
        BookTypeId = domainModel.BookTypeId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}