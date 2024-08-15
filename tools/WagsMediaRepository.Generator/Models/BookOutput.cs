using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.DownloadModels;

namespace WagsMediaRepository.Generator.Models;

public class BookOutput
{
    public string Year { get; set; } = string.Empty;

    public List<BookDownloadModel> Books { get; set; } = [];
}