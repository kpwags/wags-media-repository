namespace WagsMediaRepository.Domain.ApiModels;

public class BookSeriesApiModel
{
    public int BookSeriesId { get; set; }

    public string Name { get; set; } = string.Empty;
    
    public string ColorCode { get; set; } = string.Empty;
    
    public static BookSeriesApiModel FromDomainModel(BookSeries domainModel) => new()
    {
        BookSeriesId = domainModel.BookSeriesId,
        Name = domainModel.Name,
        ColorCode = domainModel.ColorCode,
    };
}