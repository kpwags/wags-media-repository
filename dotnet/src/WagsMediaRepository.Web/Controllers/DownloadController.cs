using Microsoft.AspNetCore.Mvc;
using WagsMediaRepository.Web.Handlers.Queries.Books;
using WagsMediaRepository.Web.Handlers.Queries.Links;
using WagsMediaRepository.Web.Handlers.Queries.Movies;
using WagsMediaRepository.Web.Handlers.Queries.Music;
using WagsMediaRepository.Web.Handlers.Queries.Podcasts;
using WagsMediaRepository.Web.Handlers.Queries.Television;
using WagsMediaRepository.Web.Handlers.Queries.VideoGames;

namespace WagsMediaRepository.Web.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class DownloadController(IMediator mediator) : Controller
{
    private readonly IMediator _mediator = mediator;
    
    [HttpGet("links")]
    public async Task<ActionResult<IReadOnlyCollection<LinkApiModel>>> DownloadLinks(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllLinks.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
    
    [HttpGet("reading-log-links")]
    public async Task<ActionResult<IReadOnlyCollection<LinkApiModel>>> DownloadLinksForReadingLog(int readingLogIssue, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllLinks.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        var links = (result?.Value ?? []).Where(l => l.ReadingLogIssueNumber == readingLogIssue).ToList();

        return Ok(links);
    }
    
    [HttpGet("books")]
    public async Task<ActionResult<IReadOnlyCollection<BookApiModel>>> DownloadBooks(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllBooks.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
    
    [HttpGet("movies")]
    public async Task<ActionResult<IReadOnlyCollection<MovieApiModel>>> DownloadMovies(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllMovies.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
    
    [HttpGet("music")]
    public async Task<ActionResult<IReadOnlyCollection<MusicAlbumApiModel>>> DownloadMusic(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllMusicAlbums.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
    
    [HttpGet("podcasts")]
    public async Task<ActionResult<IReadOnlyCollection<PodcastApiModel>>> DownloadPodcasts(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllPodcasts.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
    
    [HttpGet("podcast-categories")]
    public async Task<ActionResult<IReadOnlyCollection<PodcastCategoryApiModel>>> DownloadPodcastCategories(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllPodcastCategories.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
    
    [HttpGet("tv")]
    public async Task<ActionResult<IReadOnlyCollection<TelevisionShowApiModel>>> DownloadTv(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllTelevisionShows.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
    
    [HttpGet("video-games")]
    public async Task<ActionResult<IReadOnlyCollection<VideoGameApiModel>>> DownloadVideoGames(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllVideoGames.Request(), cancellationToken);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.Value);
    }
}