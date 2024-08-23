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

    public enum BookType
    {
        Fiction = 1,
        NonFiction = 2,
        Reference = 3,
    }

    public enum BookFormat
    {
        Hardcover = 1,
        Paperback = 2,
        Ebook = 3,
    }

    public enum BookStatus
    {
        ToRead = 1,
        Reading = 2,
        Finished = 3,
        Abandoned = 4,
    }
}