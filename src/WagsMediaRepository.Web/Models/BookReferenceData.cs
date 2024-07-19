namespace WagsMediaRepository.Web.Models;

public class BookReferenceData
{
    public IReadOnlyCollection<BookGenreApiModel> Genres { get; set; } = [];
    
    public IReadOnlyCollection<BookTypeApiModel> Types { get; set; } = [];
    
    public IReadOnlyCollection<BookFormatApiModel> Formats { get; set; } = [];
    
    public IReadOnlyCollection<BookSeriesApiModel> Series { get; set; } = [];
    
    public IReadOnlyCollection<BookStatusApiModel> Statuses { get; set; } = [];
}