namespace WagsMediaRepository.Domain;

public static class Constants
{
    public enum VideoGameStatus
    {
        ToPlay = 1,
        InProgress = 2,
        Completed = 3,
    }
    
    public enum VideoGameCompletionStatus
    {
        NotApplicable = 1,
        Yes = 2,
        No = 3,
    }
}