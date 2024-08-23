using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.VideoGames;

public class SaveVideoGame
{
    public class Request : IRequest<OperationResult>
    {
        public int VideoGameId { get; set; }
        
        [Range(1, 3, ErrorMessage = "Completion status is required")]
        [Required(ErrorMessage = "Completion status is required")]
        public Constants.VideoGameCompletionStatus CompletionStatusId { get; set; }
    
        [Range(1, 3, ErrorMessage = "Status is required")]
        [Required(ErrorMessage = "Status is required")]
        public Constants.VideoGameStatus StatusId { get; set; }
        
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Link is required.")]
        public string Link { get; set; } = string.Empty;
        
        public DateTime? DateStarted { get; set; }
        
        public DateTime? DateCompleted { get; set; }
        
        [Range(0, 5, ErrorMessage = "Rating must be between 0 & 5")]
        public int? Rating { get; set; }
        
        public string Thoughts { get; set; } = string.Empty;
        
        public string CoverImageUrl { get; set; } = string.Empty;
        
        public int? SortOrder { get; set; }

        public string[] GenreIds { get; set; } = [];
        
        public string[] SystemIds { get; set; } = [];

        public static Request FromApiModel(VideoGameApiModel videoGame) => new()
        {
            VideoGameId = videoGame.VideoGameId,
            CompletionStatusId = videoGame.CompletionStatus,
            StatusId = videoGame.Status,
            Title = videoGame.Title,
            Link = videoGame.Link,
            DateCompleted = videoGame.DateCompleted,
            DateStarted = videoGame.DateStarted,
            Rating = videoGame.Rating,
            Thoughts = videoGame.Thoughts,
            CoverImageUrl = videoGame.CoverImageUrl,
            SortOrder = videoGame.SortOrder,
            GenreIds = videoGame.Genres.Select(g => g.VideoGameGenreId.ToString()).ToArray(),
            SystemIds = videoGame.Systems.Select(s => s.VideoGameSystemId.ToString()).ToArray(),
        };
    }

    public class Handler(IVideoGameRepository videoGameRepository) : IRequestHandler<Request, OperationResult>
    {
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.VideoGameId > 0)
                {
                    await videoGameRepository.UpdateVideoGameAsync(new VideoGame
                    {
                        VideoGameId = request.VideoGameId,
                        CompletionStatus = request.CompletionStatusId,
                        Status = request.StatusId,
                        Title = request.Title,
                        Link = request.Link,
                        DateCompleted = request.DateCompleted,
                        DateStarted = request.DateStarted,
                        Rating = request.Rating ?? 0,
                        Thoughts = request.Thoughts,
                        CoverImageUrl = request.CoverImageUrl,
                        SortOrder = request.SortOrder,
                        Genres = request.GenreIds.Select(g => int.Parse(g)).Select(g => new VideoGameGenre { VideoGameGenreId = g }).ToList(),
                        Systems = request.SystemIds.Select(s => int.Parse(s)).Select(s => new VideoGameSystem { VideoGameSystemId = s }).ToList(),
                    });
                }
                else
                {
                    await videoGameRepository.AddVideoGameAsync(new VideoGame
                    {
                        CompletionStatus = request.CompletionStatusId,
                        Status = request.StatusId,
                        Title = request.Title,
                        Link = request.Link,
                        DateCompleted = request.DateCompleted,
                        DateStarted = request.DateStarted,
                        Rating = request.Rating ?? 0,
                        Thoughts = request.Thoughts,
                        CoverImageUrl = request.CoverImageUrl,
                        SortOrder = request.SortOrder,
                        Genres = request.GenreIds.Select(g => int.Parse(g)).Select(g => new VideoGameGenre { VideoGameGenreId = g }).ToList(),
                        Systems = request.SystemIds.Select(s => int.Parse(s)).Select(s => new VideoGameSystem { VideoGameSystemId = s }).ToList(),
                    });
                }

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                return new OperationResult(e.Message);
            }
        }
    }
}