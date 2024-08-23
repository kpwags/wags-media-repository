namespace WagsMediaRepository.Loader;

public static class Utilities
{
    public static int GetInteger(string prompt)
    {
        Console.Write($"{prompt}: ");

        var numberInput = Console.ReadLine();

        if (!int.TryParse(numberInput, out int number))
        {
            throw new InvalidCastException("Improper numeric input");
        }

        return number;
    }
}