namespace WagsMediaRepository.Web.Models;

public class OperationResultValue<T>
{
    public bool IsSuccessful { get; set; }

    public string ErrorMessage { get; set; }

    public T? Value { get; set; }

    public OperationResultValue(string error)
    {
        IsSuccessful = false;
        ErrorMessage = error;
    }

    public OperationResultValue(T entity)
    {
        IsSuccessful = true;
        Value = entity;
        ErrorMessage = "";
    }

    public OperationResultValue(bool isSuccessful, T entity, string errorMessage = "")
    {
        IsSuccessful = isSuccessful;
        Value = entity;
        ErrorMessage = errorMessage;
    }
}