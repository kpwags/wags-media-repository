using System.Globalization;
using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain.Dtos;
using WagsMediaRepository.Domain.Exceptions;
using WagsMediaRepository.Infrastructure.Database;

namespace WagsMediaRepository.Infrastructure.Repositories;

public class BookRepository(IDbContextFactory<ApplicationDbContext> contextFactory) : IBookRepository
{
    private readonly IDbContextFactory<ApplicationDbContext> _contextFactory = contextFactory;
    
    #region Reference
    
    public async Task<List<BookStatus>> GetStatusesAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var statuses = await dbContext.BookStatuses
            .OrderBy(bs => bs.BookStatusId)
            .ToListAsync();
            
        return statuses
            .Select(BookStatus.FromDto)
            .ToList();
    }

    public async Task<List<BookType>> GetTypesAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var types = await dbContext.BookTypes
            .OrderBy(bt => bt.BookTypeId)
            .ToListAsync();
            
        return types
            .Select(BookType.FromDto)
            .ToList();
    }

    public async Task<List<BookFormat>> GetFormatsAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var books = await dbContext.BookFormats
            .OrderBy(bf => bf.Name)
            .ToListAsync();
            
        return books
            .Select(BookFormat.FromDto)
            .ToList();
    }
    
    #endregion Reference

    #region Genres
    
    public async Task<BookGenre?> GetGenreByIdAsync(int genreId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var genre = await dbContext.BookGenres.FindAsync(genreId);

        return genre is not null ? BookGenre.FromDto(genre) : null;
    }

    public async Task<List<BookGenre>> GetGenresAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var genres = await dbContext.BookGenres
            .OrderBy(bg => bg.Name)
            .ToListAsync();
        
        return genres.Select(BookGenre.FromDto).ToList();
    }

    public async Task<BookGenre> AddGenreAsync(BookGenre genre)
    {
        var dbContext = await _contextFactory.CreateDbContextAsync();

        var genres = await dbContext.BookGenres.ToListAsync();

        if (genres.Exists(g => g.Name.ToLower(CultureInfo.InvariantCulture) == genre.Name.Trim().ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A genre with the name '{genre.Name.Trim()}' already exists");
        }

        var newGenre = new BookGenreDto
        {
            Name = genre.Name.Trim(),
            ColorCode = genre.ColorCode.Trim(),
        };

        dbContext.BookGenres.Add(newGenre);

        await dbContext.SaveChangesAsync();

        return BookGenre.FromDto(newGenre);
    }

    public async Task<BookGenre> UpdateGenreAsync(BookGenre genre)
    {
        var dbContext = await _contextFactory.CreateDbContextAsync();
        
        var genres = await dbContext.BookGenres.Where(bg => bg.BookGenreId != genre.BookGenreId).ToListAsync();

        if (genres.Exists(g => g.Name.ToLower(CultureInfo.InvariantCulture) == genre.Name.Trim().ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A genre with the name '{genre.Name.Trim()}' already exists");
        }

        var genreToUpdate = await dbContext.BookGenres.FindAsync(genre.BookGenreId);

        if (genreToUpdate is null)
        {
            throw new ObjectNotFoundException("Could not find specified genre");
        }

        genreToUpdate.Name = genre.Name.Trim();
        genreToUpdate.ColorCode = genre.ColorCode.Trim();

        dbContext.BookGenres.Update(genreToUpdate);

        await dbContext.SaveChangesAsync();

        return BookGenre.FromDto(genreToUpdate);
    }

    public async Task DeleteGenreAsync(int genreId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        await dbContext.BookGenres.Where(bg => bg.BookGenreId == genreId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion Genres

    #region Series
    
    public async Task<BookSeries?> GetSeriesByIdAsync(int seriesId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var series = await dbContext.BookSeries.FindAsync(seriesId);

        return series is not null ? BookSeries.FromDto(series) : null;
    }

    public async Task<List<BookSeries>> GetSeriesAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var series = await dbContext.BookSeries
            .OrderBy(bs => bs.Name)
            .ToListAsync();
        
        return series.Select(BookSeries.FromDto).ToList();
    }

    public async Task<BookSeries> AddSeriesAsync(BookSeries series)
    {
        var dbContext = await _contextFactory.CreateDbContextAsync();

        var seriesList = await dbContext.BookSeries.ToListAsync();

        if (seriesList.Exists(s => s.Name.ToLower(CultureInfo.InvariantCulture) == series.Name.Trim().ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A series with the name '{series.Name.Trim()}' already exists");
        }

        var newSeries = new BookSeriesDto
        {
            Name = series.Name.Trim(),
            ColorCode = series.ColorCode.Trim(),
        };

        dbContext.BookSeries.Add(newSeries);

        await dbContext.SaveChangesAsync();

        return BookSeries.FromDto(newSeries);
    }

    public async Task<BookSeries> UpdateSeriesAsync(BookSeries series)
    {
        var dbContext = await _contextFactory.CreateDbContextAsync();
        
        var seriesList = await dbContext.BookSeries.Where(b => b.BookSeriesId != series.BookSeriesId).ToListAsync();

        if (seriesList.Exists(g => g.Name.ToLower(CultureInfo.InvariantCulture) == series.Name.Trim().ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A series with the name '{series.Name.Trim()}' already exists");
        }

        var seriesToUpdate = await dbContext.BookSeries.FindAsync(series.BookSeriesId);

        if (seriesToUpdate is null)
        {
            throw new ObjectNotFoundException("Could not find specified series");
        }

        seriesToUpdate.Name = series.Name.Trim();
        seriesToUpdate.ColorCode = series.ColorCode.Trim();

        dbContext.BookSeries.Update(seriesToUpdate);

        await dbContext.SaveChangesAsync();

        return BookSeries.FromDto(seriesToUpdate);
    }

    public async Task DeleteSeriesAsync(int seriesId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        await dbContext.BookSeries.Where(bs => bs.BookSeriesId == seriesId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    #endregion Series

    #region Books
    
    public async Task<Book?> GetBookByIdAsync(int bookId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var book = await dbContext.Books
            .Include(b => b.BookStatus)
            .Include(b => b.BookType)
            .Include(b => b.BookSeries)
            .Include(b => b.BookToBookFormats)
            .ThenInclude(bf => bf.BookFormat)
            .Include(b => b.BookToBookGenres)
            .ThenInclude(bg => bg.BookGenre)
            .FirstOrDefaultAsync(b => b.BookId == bookId);

        return book is not null ? Book.FromDto(book) : null;
    }

    public async Task<List<Book>> GetBooksAsync()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var books = await dbContext.Books
            .Include(b => b.BookStatus)
            .Include(b => b.BookType)
            .Include(b => b.BookSeries)
            .Include(b => b.BookToBookFormats)
            .ThenInclude(bf => bf.BookFormat)
            .Include(b => b.BookToBookGenres)
            .ThenInclude(bg => bg.BookGenre)
            .OrderBy(b => b.SortOrder)
            .ToListAsync();

        return books.Select(Book.FromDto).ToList();
    }

    public async Task<Book> AddBookAsync(Book book)
    {
        var dbContext = await _contextFactory.CreateDbContextAsync();

        var books = await dbContext.Books.ToListAsync();

        if (books.Exists(b => b.Title.ToLower(CultureInfo.InvariantCulture) == book.Title.Trim().ToLower(CultureInfo.InvariantCulture)
            && b.SubTitle.ToLower(CultureInfo.InvariantCulture) == book.SubTitle.Trim().ToLower(CultureInfo.InvariantCulture)
            && b.Author.ToLower(CultureInfo.InvariantCulture) == book.Author.Trim().ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A book with the name '{book.Title.Trim()}' already exists");
        }
        
        var status = await dbContext.BookStatuses.FindAsync(book.BookStatusId);

        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find status");
        }
        
        var bookType = await dbContext.BookTypes.FindAsync(book.BookTypeId);

        if (bookType is null)
        {
            throw new ObjectNotFoundException("Unable to find type");
        }

        BookSeriesDto? bookSeries = null;

        if (book.BookSeriesId > 0)
        {
            bookSeries = await dbContext.BookSeries.FindAsync(book.BookSeriesId);
            
            if (bookSeries is null)
            {
                throw new ObjectNotFoundException("Unable to find series");
            }
        }

        var bookToAdd = new BookDto
        {
            BookStatus = status,
            BookType = bookType,
            BookSeries = bookSeries,
            Title = book.Title.Trim(),
            SubTitle = book.SubTitle.Trim(),
            Author = book.Author.Trim(),
            Link = book.Link.Trim(),
            DateStarted = book.DateStarted,
            DateCompleted = book.DateCompleted,
            Rating = book.Rating,
            BookNotesUrl = book.BookNotesUrl.Trim(),
            Thoughts = book.Thoughts.Trim(),
            CoverImageUrl = book.CoverImageUrl.Trim(),
            IsAtLibrary = book.IsAtLibrary,
            IsPurchased = book.IsPurchased,
            CurrentPage = book.CurrentPage,
            PageCount = book.PageCount,
            SortOrder = book.SortOrder,
            BookToBookFormats = book.Formats
                .Select(f => new BookToBookFormatDto
                {
                    BookFormat = dbContext.BookFormats.First(bf => bf.BookFormatId == f.BookFormatId),
                })
                .ToList(),
            BookToBookGenres = book.Genres
                .Select(g => new BookToBookGenreDto
                {
                    BookGenre = dbContext.BookGenres.First(bg => bg.BookGenreId == g.BookGenreId),
                })
                .ToList(),
        };

        dbContext.Books.Add(bookToAdd);

        await dbContext.SaveChangesAsync();

        return Book.FromDto(bookToAdd);
    }

    public async Task<Book> UpdateBookAsync(Book book)
    {
        var dbContext = await _contextFactory.CreateDbContextAsync();
        
        var bookToUpdate = await dbContext.Books.FindAsync(book.BookId);

        if (bookToUpdate is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified book");
        }

        var books = await dbContext.Books.Where(b => b.BookId != book.BookId).ToListAsync();

        if (books.Exists(b => b.Title.ToLower(CultureInfo.InvariantCulture) == book.Title.Trim().ToLower(CultureInfo.InvariantCulture)
                              && b.SubTitle.ToLower(CultureInfo.InvariantCulture) == book.SubTitle.Trim().ToLower(CultureInfo.InvariantCulture)
                              && b.Author.ToLower(CultureInfo.InvariantCulture) == book.Author.Trim().ToLower(CultureInfo.InvariantCulture)))
        {
            throw new DuplicateException($"A book with the name '{book.Title.Trim()}' already exists");
        }
        
        var status = await dbContext.BookStatuses.FindAsync(book.BookStatusId);

        if (status is null)
        {
            throw new ObjectNotFoundException("Unable to find status");
        }
        
        var bookType = await dbContext.BookTypes.FindAsync(book.BookTypeId);

        if (bookType is null)
        {
            throw new ObjectNotFoundException("Unable to find type");
        }
        
        BookSeriesDto? bookSeries = null;

        if (book.BookSeriesId > 0)
        {
            bookSeries = await dbContext.BookSeries.FindAsync(book.BookSeriesId);
            
            if (bookSeries is null)
            {
                throw new ObjectNotFoundException("Unable to find series");
            }
        }

        await Task.WhenAll(
            ClearGenres(book.BookId),
            ClearFormats(book.BookId)
        );
        
        bookToUpdate.BookStatus = status;
        bookToUpdate.BookType = bookType;
        bookToUpdate.BookSeries = bookSeries;
        bookToUpdate.Title = book.Title.Trim();
        bookToUpdate.SubTitle = book.SubTitle.Trim();
        bookToUpdate.Author = book.Author.Trim();
        bookToUpdate.Link = book.Link.Trim();
        bookToUpdate.DateStarted = book.DateStarted;
        bookToUpdate.DateCompleted = book.DateCompleted;
        bookToUpdate.Rating = book.Rating;
        bookToUpdate.BookNotesUrl = book.BookNotesUrl.Trim();
        bookToUpdate.Thoughts = book.Thoughts.Trim();
        bookToUpdate.CoverImageUrl = book.CoverImageUrl.Trim();
        bookToUpdate.IsAtLibrary = book.IsAtLibrary;
        bookToUpdate.IsPurchased = book.IsPurchased;
        bookToUpdate.CurrentPage = book.CurrentPage;
        bookToUpdate.PageCount = book.PageCount;
        bookToUpdate.SortOrder = book.SortOrder;
        bookToUpdate.BookToBookFormats = book.Formats
            .Select(f => new BookToBookFormatDto
            {
                BookFormat = dbContext.BookFormats.First(bf => bf.BookFormatId == f.BookFormatId),
            })
            .ToList();
        bookToUpdate.BookToBookGenres = book.Genres
            .Select(g => new BookToBookGenreDto
            {
                BookGenre = dbContext.BookGenres.First(bg => bg.BookGenreId == g.BookGenreId),
            })
            .ToList();

        dbContext.Books.Update(bookToUpdate);

        await dbContext.SaveChangesAsync();

        return Book.FromDto(bookToUpdate);
    }

    public async Task DeleteBookAsync(int bookId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        await dbContext.BookToBookFormats.Where(bf => bf.BookId == bookId).ExecuteDeleteAsync();
        await dbContext.BookToBookGenres.Where(bf => bf.BookId == bookId).ExecuteDeleteAsync();
        await dbContext.Books.Where(bf => bf.BookId == bookId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }

    public async Task<int> GetNextSortOrder()
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();

        var books = await dbContext.Books.ToListAsync();

        var maxSortOrder = books.Max(b => b.SortOrder);

        return (maxSortOrder ?? 0) + 10;
    }
    
    #endregion Books
    
    #region Utilities
    private async Task ClearGenres(int bookId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        await dbContext.BookToBookGenres.Where(bg => bg.BookId == bookId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    
    private async Task ClearFormats(int bookId)
    {
        await using var dbContext = await _contextFactory.CreateDbContextAsync();
        
        await dbContext.BookToBookFormats.Where(bf => bf.BookId == bookId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion Utilities
}