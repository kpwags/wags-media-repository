namespace WagsMediaRepository.Domain.ApiModels;

public class BookStatusApiModel
{
    public int BookStatusId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;

    public static BookStatusApiModel FromDomainModel(BookStatus domainModel) => new()
    {
        BookStatusId = domainModel.BookStatusId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}