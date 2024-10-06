namespace WagsMediaGenerator;

public static class Constants
{
    public static class BookStatus
    {
        public static readonly string ToRead = "To Read";
        public static readonly string Reading = "Reading";
        public static readonly string Finished = "Finished";
        public static readonly string Abandoned = "Abandoned";
    }
    
    public static class MovieStatus
    {
        public static readonly string JointList = "Joint To Watch";
        public static readonly string PersonalList = "Personal To Watch";
        public static readonly string Watched = "Watched";
        public static readonly string CouldNotFinish = "Couldn't Finish";
    }

    public static class VideoGameStatus
    {
        public static readonly string ToPlay = "To Play";
        public static readonly string InProgress = "In Progress";
        public static readonly string Finished = "Completed";
    }
    
    public enum VideoGameCompletionStatus
    {
        NotApplicable = 1,
        Yes = 2,
        No = 3,
    }
    
    public static class TelevisionStatus
    {
        public static readonly string JointList = "Joint To-Watch";
        public static readonly string PersonalList = "Personal To-Watch";
        public static readonly string Watching = "Watching";
        public static readonly string InBetweenSeasons = "In Between Seasons";
        public static readonly string Watched = "Watched";
        public static readonly string CouldNotFinish = "Couldn't Finish";
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
}