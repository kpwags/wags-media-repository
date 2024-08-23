using System.Globalization;
using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain.Dtos;
using WagsMediaRepository.Domain.Exceptions;
using WagsMediaRepository.Infrastructure.Database;
using WagsMediaRepository.Infrastructure.Helpers;

namespace WagsMediaRepository.Infrastructure.Repositories;

public class MusicRepository(IDbContextFactory<ApplicationDbContext> contextFactory) : IMusicRepository
{
    private readonly IDbContextFactory<ApplicationDbContext> _contextFactory = contextFactory;

    #region Reference
    
    public async Task<List<MusicFormat>> GetFormatsAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var formats = await dbContext.MusicFormats
            .OrderBy(mf => mf.Name)
            .ToListAsync();
            
        return formats
            .Select(MusicFormat.FromDto)
            .ToList();
    }
    
    #endregion Reference

    #region Genres
    
    public async Task<MusicGenre?> GetGenreByIdAsync(int genreId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var genre = await dbContext.MusicGenres.FindAsync(genreId);

        return genre is not null ? MusicGenre.FromDto(genre) : null;
    }

    public async Task<List<MusicGenre>> GetGenresAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var genres = await dbContext.MusicGenres
            .OrderBy(mg => mg.Name)
            .ToListAsync();

        return genres
            .Select(MusicGenre.FromDto)
            .ToList();
    }

    public async Task<MusicGenre> AddGenreAsync(MusicGenre genre)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var existingGenres = await dbContext.MusicGenres.ToListAsync();

        if (existingGenres.Exists(g => g.Name.ToLower(CultureInfo.InvariantCulture) == genre.Name.ToLower(CultureInfo.InvariantCulture).Trim()))
        {
            throw new DuplicateException($"Genre with name '{genre.Name.Trim()}' already exists.");
        }

        var genreToAdd = new MusicGenreDto
        {
            Name = genre.Name.Trim(),
            ColorCode = genre.ColorCode,
        };

        dbContext.MusicGenres.Add(genreToAdd);

        await dbContext.SaveChangesAsync();

        return MusicGenre.FromDto(genreToAdd);
    }

    public async Task<MusicGenre> UpdateGenreAsync(MusicGenre genre)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var genreToUpdate = await dbContext.MusicGenres.FindAsync(genre.MusicGenreId);

        if (genreToUpdate is null)
        {
            throw new ObjectNotFoundException("Specified genre not found");
        }
        
        var existingGenres = await dbContext.MusicGenres.Where(g => g.MusicGenreId != genre.MusicGenreId).ToListAsync();

        if (existingGenres.Exists(g => g.Name.ToLower(CultureInfo.InvariantCulture) == genre.Name.ToLower(CultureInfo.InvariantCulture).Trim()))
        {
            throw new DuplicateException($"Genre with name '{genre.Name.Trim()}' already exists.");
        }

        genreToUpdate.Name = genre.Name.Trim();
        genreToUpdate.ColorCode = genre.ColorCode;

        dbContext.MusicGenres.Update(genreToUpdate);

        await dbContext.SaveChangesAsync();

        return MusicGenre.FromDto(genreToUpdate);
    }

    public async Task DeleteGenreAsync(int genreId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        await dbContext.MusicAlbumToMusicGenres.Where(g => g.MusicGenreId == genreId).ExecuteDeleteAsync();
        await dbContext.MusicGenres.Where(g => g.MusicGenreId == genreId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion Genres
    
    #region Tracks

    public async Task<MusicAlbumTrack?> GetTrackByIdAsync(int trackId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var track = await dbContext.MusicAlbumTracks.FindAsync(trackId);

        return track is not null ? MusicAlbumTrack.FromDto(track) : null;
    }

    public async Task<List<MusicAlbumTrack>> GetTracksForAlbumAsync(int albumId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var tracks = await dbContext.MusicAlbumTracks
            .Where(t => t.MusicAlbumId == albumId)
            .OrderBy(t => t.TrackNumber)
            .ToListAsync();

        return tracks.Select(MusicAlbumTrack.FromDto).ToList();
    }

    public async Task<MusicAlbumTrack> AddTrackAsync(MusicAlbumTrack track)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var album = await dbContext.MusicAlbums.FindAsync(track.MusicAlbumId);

        if (album is null)
        {
            throw new ObjectNotFoundException("Album not found");
        }

        var trackToAdd = new MusicAlbumTrackDto
        {
            MusicAlbum = album,
            TrackNumber = track.TrackNumber,
            Title = track.Title.Trim(),
        };

        dbContext.MusicAlbumTracks.Add(trackToAdd);

        await dbContext.SaveChangesAsync();

        return MusicAlbumTrack.FromDto(trackToAdd);
    }

    public async Task AddTracksAsync(int albumId, List<MusicAlbumTrack> tracks)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        var album = await dbContext.MusicAlbums.FindAsync(albumId);

        if (album is null)
        {
            throw new ObjectNotFoundException("Album not found");
        }

        foreach (var track in tracks)
        {
            var trackToAdd = new MusicAlbumTrackDto
            {
                MusicAlbum = album,
                TrackNumber = track.TrackNumber,
                Title = track.Title.Trim(),
            };

            dbContext.MusicAlbumTracks.Add(trackToAdd);
        }

        await dbContext.SaveChangesAsync();
    }

    public async Task<MusicAlbumTrack> UpdateTrackAsync(MusicAlbumTrack track)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        var trackToUpdate = await dbContext.MusicAlbumTracks.FindAsync(track.MusicAlbumTrackId);

        if (trackToUpdate is null)
        {
            throw new ObjectNotFoundException("Track not found");
        }
        
        var album = await dbContext.MusicAlbums.FindAsync(track.MusicAlbumId);

        if (album is null)
        {
            throw new ObjectNotFoundException("Album not found");
        }

        trackToUpdate.MusicAlbum = album;
        trackToUpdate.TrackNumber = track.TrackNumber;
        trackToUpdate.Title = track.Title.Trim();

        dbContext.MusicAlbumTracks.Update(trackToUpdate);

        await dbContext.SaveChangesAsync();
        
        return MusicAlbumTrack.FromDto(trackToUpdate);
    }

    public async Task UpdateTracksAsync(int albumId, List<MusicAlbumTrack> tracks)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        var album = await dbContext.MusicAlbums.FindAsync(albumId);

        if (album is null)
        {
            throw new ObjectNotFoundException("Album not found");
        }

        var allTracksUpdated = true;
        
        foreach (var track in tracks)
        {
            var trackToUpdate = await dbContext.MusicAlbumTracks.FindAsync(track.MusicAlbumTrackId);

            if (trackToUpdate is null)
            {
                allTracksUpdated = false;
                continue;
            }

            trackToUpdate.MusicAlbum = album;
            trackToUpdate.TrackNumber = track.TrackNumber;
            trackToUpdate.Title = track.Title.Trim();

            dbContext.MusicAlbumTracks.Update(trackToUpdate);
        }

        await dbContext.SaveChangesAsync();

        if (!allTracksUpdated)
        {
            throw new SaveDataException("At least one track was not updated. Please refresh the page and try again.");
        }
    }

    public async Task DeleteTrackAsync(int trackId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        await dbContext.MusicAlbumTracks.Where(t => t.MusicAlbumTrackId == trackId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion Tracks
    
    #region Albums

    public async Task<MusicAlbum?> GetAlbumByIdAsync(int albumId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var album = await dbContext.MusicAlbums
            .Include(m => m.MusicAlbumToMusicFormats)
            .ThenInclude(mf => mf.MusicFormat)
            .Include(m => m.MusicAlbumToMusicGenres)
            .ThenInclude(mg => mg.MusicGenre)
            .Include(m => m.MusicAlbumTracks)
            .FirstOrDefaultAsync(m => m.MusicAlbumId == albumId);

        return album is not null ? MusicAlbum.FromDto(album) : null;
    }

    public async Task<List<MusicAlbum>> GetAlbumsAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
       
        var albums = await dbContext.MusicAlbums
            .Include(m => m.MusicAlbumToMusicFormats)
            .ThenInclude(mf => mf.MusicFormat)
            .Include(m => m.MusicAlbumToMusicGenres)
            .ThenInclude(mg => mg.MusicGenre)
            .Include(m => m.MusicAlbumTracks)
            .ToListAsync();

        return albums
            .OrderBy(a => Sorters.SortByTitle(a.Artist))
            .ThenBy(a => Sorters.SortByTitle(a.Title))
            .Select(MusicAlbum.FromDto)
            .ToList();
    }

    public async Task<MusicAlbum> AddAlbumAsync(MusicAlbum album)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var existingAlbums = await dbContext.MusicAlbums.ToListAsync();

        if (existingAlbums.Exists(a => a.Title.Equals(album.Title.ToLower(CultureInfo.InvariantCulture).Trim(), StringComparison.CurrentCultureIgnoreCase)
                                       && a.Artist.Equals(album.Artist.ToLower(CultureInfo.InvariantCulture).Trim(), StringComparison.CurrentCultureIgnoreCase)))
        {
            throw new DuplicateException($"The album '{album.Title.Trim()}' already exists");
        }

        var albumToAdd = new MusicAlbumDto
        {
            Artist = album.Artist.Trim(),
            Title = album.Title.Trim(),
            CoverImageUrl = album.CoverImageUrl.Trim(),
            IsTopTen = album.IsTopTen,
            ShowOnNowPage = album.ShowOnNowPage,
            Thoughts = album.Thoughts,
            MusicAlbumToMusicFormats = album.Formats
                .Select(f => new MusicAlbumToMusicFormatDto
                {
                    MusicFormat = dbContext.MusicFormats.First(mf => mf.MusicFormatId == f.MusicFormatId),
                })
                .ToList(),
            MusicAlbumToMusicGenres = album.Genres
                .Select(g => new MusicAlbumToMusicGenreDto
                {
                    MusicGenre = dbContext.MusicGenres.First(mg => mg.MusicGenreId == g.MusicGenreId),
                })
                .ToList(),
        };

        dbContext.MusicAlbums.Add(albumToAdd);

        await dbContext.SaveChangesAsync();
        
        return MusicAlbum.FromDto(albumToAdd);
    }

    public async Task<MusicAlbum> UpdateAlbumAsync(MusicAlbum album)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        var albumToUpdate = await dbContext.MusicAlbums.FindAsync(album.MusicAlbumId);

        if (albumToUpdate is null)
        {
            throw new ObjectNotFoundException("Album not found");
        }
        
        var existingAlbums = await dbContext.MusicAlbums.Where(a => a.MusicAlbumId != album.MusicAlbumId).ToListAsync();

        if (existingAlbums.Exists(a => a.Title.Equals(album.Title.ToLower(CultureInfo.InvariantCulture).Trim(), StringComparison.CurrentCultureIgnoreCase)
                                       && a.Artist.Equals(album.Artist.ToLower(CultureInfo.InvariantCulture).Trim(), StringComparison.CurrentCultureIgnoreCase)))
        {
            throw new DuplicateException($"The album '{album.Title.Trim()}' already exists");
        }

        await Task.WhenAll(
            ClearFormats(album.MusicAlbumId),
            ClearGenres(album.MusicAlbumId)
        );

        albumToUpdate.Artist = album.Artist.Trim();
        albumToUpdate.Title = album.Title.Trim();
        albumToUpdate.CoverImageUrl = album.CoverImageUrl.Trim();
        albumToUpdate.IsTopTen = album.IsTopTen;
        albumToUpdate.ShowOnNowPage = album.ShowOnNowPage;
        albumToUpdate.Thoughts = album.Thoughts;
        albumToUpdate.MusicAlbumToMusicFormats = album.Formats
            .Select(f => new MusicAlbumToMusicFormatDto
            {
                MusicFormat = dbContext.MusicFormats.First(mf => mf.MusicFormatId == f.MusicFormatId),
            })
            .ToList();
        albumToUpdate.MusicAlbumToMusicGenres = album.Genres
            .Select(g => new MusicAlbumToMusicGenreDto
            {
                MusicGenre = dbContext.MusicGenres.First(mg => mg.MusicGenreId == g.MusicGenreId),
            })
            .ToList();

        dbContext.MusicAlbums.Update(albumToUpdate);

        await dbContext.SaveChangesAsync();
        
        return MusicAlbum.FromDto(albumToUpdate);
    }

    public async Task DeleteAlbumAsync(int albumId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        await Task.WhenAll(
            dbContext.MusicAlbumTracks.Where(t => t.MusicAlbumId == albumId).ExecuteDeleteAsync(),
            dbContext.MusicAlbumToMusicFormats.Where(f => f.MusicAlbumId == albumId).ExecuteDeleteAsync(),
            dbContext.MusicAlbumToMusicGenres.Where(g => g.MusicAlbumId == albumId).ExecuteDeleteAsync()
        );
        
        await dbContext.MusicAlbums.Where(a => a.MusicAlbumId == albumId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion Albums
    
    #region Utilities
    
    private async Task ClearFormats(int albumId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        await dbContext.MusicAlbumToMusicFormats.Where(mf => mf.MusicAlbumId == albumId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    private async Task ClearGenres(int albumId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        await dbContext.MusicAlbumToMusicGenres.Where(mg => mg.MusicAlbumId == albumId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion Utilities
}