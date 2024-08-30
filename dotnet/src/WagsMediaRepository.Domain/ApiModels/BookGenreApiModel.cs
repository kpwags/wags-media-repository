namespace WagsMediaRepository.Domain.ApiModels;

public class BookGenreApiModel
{
    public int BookGenreId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookGenreApiModel FromDomainModel(BookGenre domainModel) => new()
    {
        BookGenreId = domainModel.BookGenreId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}