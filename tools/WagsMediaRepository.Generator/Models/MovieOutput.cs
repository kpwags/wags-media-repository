using WagsMediaRepository.Domain.ApiModels;
using WagsMediaRepository.Generator.DownloadModels;

namespace WagsMediaRepository.Generator.Models;

public class MovieOutput
{
    public string Year { get; set; } = string.Empty;

    public List<MovieDownloadModel> Movies { get; set; } = [];
}