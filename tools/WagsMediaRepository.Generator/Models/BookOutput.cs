using WagsMediaRepository.Domain.ApiModels;

namespace WagsMediaRepository.Generator.Models;

public class BookOutput
{
    public string Year { get; set; } = string.Empty;

    public List<BookApiModel> Books { get; set; } = [];
}