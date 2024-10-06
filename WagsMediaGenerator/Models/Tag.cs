namespace WagsMediaGenerator.Models;

public class Tag
{
    public string Name { get; set; } = string.Empty;

    public string ColorCode { get; set; } = string.Empty;
    
    public Tag() { }

    public Tag(string name, string color)
    {
        Name = name;
        ColorCode = color;
    }
}