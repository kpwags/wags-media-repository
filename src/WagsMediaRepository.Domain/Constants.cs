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
    
    public enum MovieStatus
    {
        PersonalToWatch = 1,
        JointWatch = 2,
        Watched = 3,
        CouldNotFinish = 4,
    }
    
    public enum TelevisionStatus
    {
        PersonalToWatch = 1,
        JointWatch = 2,
        Watching = 3,
        InBetweenSeasons = 4,
        Watched = 5,
        CouldNotFinish = 6,
    }
}