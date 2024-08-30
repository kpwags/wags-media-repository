namespace WagsMediaRepository.Web.Models;

public class OperationResult
{
    public bool IsSuccessful { get; init; }

    public string ErrorMessage { get; init; }

    public OperationResult(string error)
    {
        IsSuccessful = false;
        ErrorMessage = error;
    }

    public OperationResult(bool isSuccessful, string error = "")
    {
        IsSuccessful = true;
        ErrorMessage = error;
    }
}