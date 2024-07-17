namespace WagsMediaRepository.Infrastructure.Helpers;

public static class Sorters
{
    public static string SortByTitle(string title) =>
        title.StartsWith("A ", StringComparison.OrdinalIgnoreCase) || title.StartsWith("The ", StringComparison.OrdinalIgnoreCase)
            ? title.Substring(title.IndexOf(" ", StringComparison.Ordinal) + 1)
            : title;
}