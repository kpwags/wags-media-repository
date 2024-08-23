namespace WagsMediaRepository.Application.Repositories;

public interface IBookRepository
{
    #region Reference

    Task<List<BookStatus>> GetStatusesAsync();

    Task<List<BookType>> GetTypesAsync();

    Task<List<BookFormat>> GetFormatsAsync();

    #endregion Reference
    
    #region Genres

    Task<BookGenre?> GetGenreByIdAsync(int genreId);

    Task<List<BookGenre>> GetGenresAsync();

    Task<BookGenre> AddGenreAsync(BookGenre genre);

    Task<BookGenre> UpdateGenreAsync(BookGenre genre);

    Task DeleteGenreAsync(int genreId);

    #endregion Genres
    
    #region Series

    Task<BookSeries?> GetSeriesByIdAsync(int seriesId);

    Task<List<BookSeries>> GetSeriesAsync();

    Task<BookSeries> AddSeriesAsync(BookSeries series);

    Task<BookSeries> UpdateSeriesAsync(BookSeries series);

    Task DeleteSeriesAsync(int seriesId);

    #endregion Series
    
    #region Books

    Task<Book?> GetBookByIdAsync(int bookId);

    Task<List<Book>> GetBooksAsync();

    Task<Book> AddBookAsync(Book book);

    Task<Book> UpdateBookAsync(Book book);

    Task DeleteBookAsync(int bookId);

    Task<int> GetNextSortOrder();

    #endregion Books
}