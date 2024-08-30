namespace WagsMediaRepository.Domain.Exceptions;

public class SaveDataException : Exception
{
    public SaveDataException() { }
    
    public SaveDataException(string message) : base(message) { }
    
    public SaveDataException(string message, Exception innerException) : base(message, innerException) { }
}