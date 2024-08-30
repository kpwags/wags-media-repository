using System.ComponentModel.DataAnnotations;
using WagsMediaRepository.Domain.Models;

namespace WagsMediaRepository.Web.Handlers.Commands.Television;

public class SaveTelevisionShow
{
    public class Request : IRequest<OperationResult>
    {
        public int TelevisionShowId { get; set; }
        
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "IMDb link is required.")]
        public string ImdbLink { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Status is required.")]
        public int TelevisionStatusId { get; set; }
        
        public int? SortOrder { get; set; }
        
        [Range(0, 5, ErrorMessage = "Rating must be between 0 & 5")]
        public int Rating { get; set; }

        public string Thoughts { get; set; } = string.Empty;
    
        public string CoverImageUrl { get; set; } = string.Empty;
    
        public int CurrentSeason { get; set; }
    
        public int NumberOfSeasons { get; set; }

        public IList<int> GenreIds { get; set; } = [];

        public IList<int> ServiceIds { get; set; } = [];
        
        public Request() { }

        public Request(TelevisionShowApiModel tvShow)
        {
            TelevisionShowId = tvShow.TelevisionShowId;
            Title = tvShow.Title;
            ImdbLink = tvShow.ImdbLink;
            TelevisionStatusId = tvShow.TelevisionStatusId;
            SortOrder = tvShow.SortOrder;
            Rating = tvShow.Rating;
            Thoughts = tvShow.Thoughts;
            CoverImageUrl = tvShow.CoverImageUrl;
            CurrentSeason = tvShow.CurrentSeason;
            NumberOfSeasons = tvShow.NumberOfSeasons;
            GenreIds = tvShow.Genres.Select(g => g.TelevisionGenreId).ToArray();
            ServiceIds = tvShow.Services.Select(s => s.TelevisionServiceId).ToArray();
        }

        public TelevisionShow ConvertToTelevisionShow() => new()
        {
            TelevisionShowId = TelevisionShowId,
            Title = Title,
            ImdbLink = ImdbLink,
            SortOrder = SortOrder,
            TelevisionStatusId = TelevisionStatusId,
            Rating = Rating,
            Thoughts = Thoughts,
            CoverImageUrl = CoverImageUrl,
            CurrentSeason = CurrentSeason,
            NumberOfSeasons = NumberOfSeasons,
            Genres = GenreIds.Select(g => new TelevisionGenre { TelevisionGenreId = g }).ToList(),
            Services = ServiceIds.Select(s => new TelevisionService { TelevisionServiceId = s }).ToList(),
        };
    }
    
    public class Handler(ITelevisionRepository televisionRepository) : IRequestHandler<Request, OperationResult>
    {
        private readonly ITelevisionRepository _televisionRepository = televisionRepository;
        
        public async Task<OperationResult> Handle(Request request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.TelevisionShowId > 0)
                {
                    await _televisionRepository.UpdateTelevisionShowAsync(request.ConvertToTelevisionShow());
                }
                else
                {
                    await _televisionRepository.AddTelevisionShowAsync(request.ConvertToTelevisionShow());
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