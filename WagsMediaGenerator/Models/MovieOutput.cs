namespace WagsMediaGenerator.Models;

public class MovieOutput
{
    public string Year { get; set; } = string.Empty;

    public List<Movie> Movies { get; set; } = [];
}