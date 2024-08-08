using WagsMediaRepository.Domain.ApiModels;

namespace WagsMediaRepository.Generator.Models;

public class MovieOutput
{
    public string Year { get; set; } = string.Empty;

    public List<MovieApiModel> Movies { get; set; } = [];
}