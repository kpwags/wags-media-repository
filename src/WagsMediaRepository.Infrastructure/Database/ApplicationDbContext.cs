using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WagsMediaRepository.Domain.Dtos;

namespace WagsMediaRepository.Infrastructure.Database;

public class ApplicationDbContext(IConfiguration configuration) : DbContext
{
    #region "DB Sets"
    
    public DbSet<BookDto> Books { get; set; }
    
    public DbSet<BookFormatDto> BookFormats { get; set; }
    
    public DbSet<BookGenreDto> BookGenres { get; set; }
    
    public DbSet<BookSeriesDto> BookSeries { get; set; }
    
    public DbSet<BookStatusDto> BookStatuses { get; set; }
    
    public DbSet<BookToBookFormatDto> BookToBookFormats { get; set; }
    
    public DbSet<BookToBookGenreDto> BookToBookGenres { get; set; }
    
    public DbSet<BookTypeDto> BookTypes { get; set; }
    
    public DbSet<LinkCategoryDto> LinkCategories { get; set; }
    
    public DbSet<LinkDto> Links { get; set; }
    
    public DbSet<LinkTypeDto> LinkTypes { get; set; }
    
    public DbSet<MovieDto> Movies { get; set; }
    
    public DbSet<MovieGenreDto> MovieGenres { get; set; }
    
    public DbSet<MovieStatusDto> MovieStatuses { get; set; }
    
    public DbSet<MovieToMovieGenreDto> MovieToMovieGenres { get; set; }
    
    public DbSet<MovieServiceDto> MovieServices { get; set; }
    
    public DbSet<MovieToMovieServiceDto> MovieToMovieServicess { get; set; }
    
    public DbSet<MusicAlbumDto> MusicAlbums { get; set; }
    
    public DbSet<MusicAlbumToMusicFormatDto> MusicAlbumToMusicFormats { get; set; }
    
    public DbSet<MusicAlbumToMusicGenreDto> MusicAlbumToMusicGenres { get; set; }
    
    public DbSet<MusicAlbumTrackDto> MusicAlbumTracks { get; set; }
    
    public DbSet<MusicFormatDto> MusicFormats { get; set; }
    
    public DbSet<MusicGenreDto> MusicGenres { get; set; }
    
    public DbSet<PodcastCategoryDto> PodcastCategories { get; set; }
    
    public DbSet<PodcastDto> Podcasts { get; set; }
    
    public DbSet<TelevisionShowDto> TelevisionShows { get; set; }
    
    public DbSet<TelevisionGenreDto> TelevisionGenres { get; set; }
    
    public DbSet<TelevisionServiceDto> TelevisionServices { get; set; }
    
    public DbSet<TelevisionStatusDto> TelevisionStatuses { get; set; }
    
    public DbSet<TelevisionShowToTelevisionGenreDto> TelevisionToTelevisionGenres { get; set; }
    
    public DbSet<TelevisionShowToTelevisionServiceDto> TelevisionToTelevisionServices { get; set; }
    
    public DbSet<VideoGameCompletionDto> VideoGameCompletions { get; set; }
    
    public DbSet<VideoGameDto> VideoGames { get; set; }
    
    public DbSet<VideoGameGenreDto> VideoGameGenres { get; set; }
    
    public DbSet<VideoGameStatusDto> VideoGameStatuses { get; set; }
    
    public DbSet<VideoGameSystemDto> VideoGameSystems { get; set; }
    
    public DbSet<VideoGameToVideoGameGenreDto> VideoGameToVideoGameGenres { get; set; }
    
    public DbSet<VideoGameToVideoGameSystemDto> VideoGameToVideoGameSystems { get; set; }
    
    #endregion "DB Sets"
    
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to sqlite database
        options.UseSqlite(configuration.GetConnectionString("RepoDb"), b => b.MigrationsAssembly("WagsMediaRepository.Web"));
    }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasDefaultSchema("application");

        #region "Books"
        
        #region "Book"
        builder.Entity<BookDto>()
            .ToTable("Book", schema: "book");
        
        builder.Entity<BookDto>()
            .HasKey(b => b.BookId)
            .HasName("PK_Book_Book");
        
        builder.Entity<BookDto>()
            .Property(b => b.Title)
            .HasMaxLength(255)
            .IsRequired();

        builder.Entity<BookDto>()
            .Property(b => b.Title)
            .HasMaxLength(255)
            .IsRequired()
            .HasDefaultValue("");
        
        builder.Entity<BookDto>()
            .Property(b => b.Link)
            .HasMaxLength(255)
            .IsRequired();

        builder.Entity<BookDto>()
            .Property(b => b.BookNotesUrl)
            .HasMaxLength(150)
            .IsRequired()
            .HasDefaultValue("");

        builder.Entity<BookDto>()
            .Property(b => b.Rating)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Entity<BookDto>()
            .Property(b => b.Thoughts)
            .HasMaxLength(2000)
            .IsRequired()
            .HasDefaultValue("");
        
        builder.Entity<BookDto>()
            .Property(b => b.CoverImageUrl)
            .HasMaxLength(255)
            .IsRequired();

        builder.Entity<BookDto>()
            .Property(b => b.IsAtLibrary)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Entity<BookDto>()
            .Property(b => b.CurrentPage)
            .IsRequired()
            .HasDefaultValue(1);
        
        builder.Entity<BookDto>()
            .HasOne(b => b.BookStatus)
            .WithMany(bs => bs.Books)
            .HasForeignKey(b => b.BookStatusId);
        
        builder.Entity<BookDto>()
            .HasOne(b => b.BookType)
            .WithMany(bt => bt.Books)
            .HasForeignKey(b => b.BookTypeId);
        
        builder.Entity<BookDto>()
            .HasOne(b => b.BookSeries)
            .WithMany(bs => bs.Books)
            .HasForeignKey(b => b.BookSeriesId);
        #endregion "Books"
        
        #region "BookStatus"
        builder.Entity<BookStatusDto>()
            .ToTable("BookStatus", schema: "book");
        
        builder.Entity<BookStatusDto>()
            .HasKey(b => b.BookStatusId)
            .HasName("PK_Book_BookStatus");
        
        builder.Entity<BookStatusDto>()
            .Property(b => b.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<BookStatusDto>()
            .Property(b => b.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "BookStatus"
        
        #region "BookType"
        builder.Entity<BookTypeDto>()
            .ToTable("BookType", schema: "book");
        
        builder.Entity<BookTypeDto>()
            .HasKey(b => b.BookTypeId)
            .HasName("PK_Book_BookType");
        
        builder.Entity<BookStatusDto>()
            .Property(b => b.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<BookStatusDto>()
            .Property(b => b.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "BookType"
        
        #region "BookSeries"
        builder.Entity<BookSeriesDto>()
            .ToTable("BookSeries", schema: "book");
        
        builder.Entity<BookSeriesDto>()
            .HasKey(b => b.BookSeriesId)
            .HasName("PK_Book_BookSeries");
        
        builder.Entity<BookSeriesDto>()
            .Property(b => b.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<BookSeriesDto>()
            .Property(b => b.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "BookSeries"
        
        #region "BookFormat"
        builder.Entity<BookFormatDto>()
            .ToTable("BookFormat", schema: "book");
        
        builder.Entity<BookFormatDto>()
            .HasKey(b => b.BookFormatId)
            .HasName("PK_Book_BookFormat");
        
        builder.Entity<BookFormatDto>()
            .Property(b => b.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<BookFormatDto>()
            .Property(b => b.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "BookFormat"
        
        #region "BookGenre"
        builder.Entity<BookGenreDto>()
            .ToTable("BookGenre", schema: "book");
        
        builder.Entity<BookGenreDto>()
            .HasKey(b => b.BookGenreId)
            .HasName("PK_Book_BookGenre");
        
        builder.Entity<BookGenreDto>()
            .Property(b => b.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<BookGenreDto>()
            .Property(b => b.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "BookGenre"

        #region "BookToBookGenre"
        builder.Entity<BookToBookGenreDto>()
            .ToTable("BookToBookGenre", schema: "book");
        
        builder.Entity<BookToBookGenreDto>()
            .HasKey(b => b.BookToBookGenreId)
            .HasName("PK_Book_BookToBookGenre");
        
        builder.Entity<BookToBookGenreDto>()
            .HasIndex(bg => new { bg.BookId, bg.BookGenreId })
            .HasDatabaseName("UQ_Book_BookToBookGenre_BookId_BookGenreId")
            .IsUnique();
        
        builder.Entity<BookToBookGenreDto>()
            .HasOne(bg => bg.Book)
            .WithMany(b => b.BookToBookGenres)
            .HasForeignKey(bg => bg.BookId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<BookToBookGenreDto>()
            .HasOne(bg => bg.BookGenre)
            .WithMany(g => g.BookToBookGenres)
            .HasForeignKey(bg => bg.BookGenreId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "BookToBookGenre"
        
        #region "BookToBookFormat"
        builder.Entity<BookToBookFormatDto>()
            .ToTable("BookToBookFormat", schema: "book");
        
        builder.Entity<BookToBookFormatDto>()
            .HasKey(b => b.BookToBookFormatId)
            .HasName("PK_Book_BookToBookFormat");
        
        builder.Entity<BookToBookFormatDto>()
            .HasIndex(bg => new { bg.BookId, bg.BookFormatId })
            .HasDatabaseName("UQ_Book_BookToBookFormat_BookId_BookFormatId")
            .IsUnique();
        
        builder.Entity<BookToBookFormatDto>()
            .HasOne(bf => bf.Book)
            .WithMany(b => b.BookToBookFormats)
            .HasForeignKey(bf => bf.BookId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<BookToBookFormatDto>()
            .HasOne(bf => bf.BookFormat)
            .WithMany(f => f.BookToBookFormats)
            .HasForeignKey(bf => bf.BookFormatId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "BookToBookFormat"
        
        #endregion "Books"

        #region "Links"

        #region "Link"
        builder.Entity<LinkDto>()
            .ToTable("Link", schema: "link");
        
        builder.Entity<LinkDto>()
            .HasKey(l => l.LinkId)
            .HasName("PK_Link_Link");
        
        builder.Entity<LinkDto>()
            .Property(l => l.Title)
            .HasMaxLength(400)
            .IsRequired();
        
        builder.Entity<LinkDto>()
            .Property(l => l.Author)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Entity<LinkDto>()
            .Property(l => l.Url)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<LinkDto>()
            .HasOne(l => l.LinkType)
            .WithMany(lt => lt.Links)
            .HasForeignKey(l => l.LinkTypeId);
        
        builder.Entity<LinkDto>()
            .HasOne(l => l.LinkCategory)
            .WithMany(lc => lc.Links)
            .HasForeignKey(l => l.LinkCategoryId);
        #endregion "Link"
        
        #region "LinkType"
        builder.Entity<LinkTypeDto>()
            .ToTable("LinkType", schema: "link");
        
        builder.Entity<LinkTypeDto>()
            .HasKey(lt => lt.LinkTypeId)
            .HasName("PK_Link_LinkType");
        
        builder.Entity<LinkTypeDto>()
            .Property(lt => lt.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<LinkTypeDto>()
            .Property(lt => lt.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "LinkType"
        
        #region "LinkCategory"
        builder.Entity<LinkCategoryDto>()
            .ToTable("LinkCategory", schema: "link");
        
        builder.Entity<LinkCategoryDto>()
            .HasKey(lc => lc.LinkCategoryId)
            .HasName("PK_Link_LinkCategory");
        
        builder.Entity<LinkCategoryDto>()
            .Property(lc => lc.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<LinkCategoryDto>()
            .Property(lc => lc.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "LinkCategory"

        #endregion "Links"

        #region "Movies"

        #region "Movie"
        builder.Entity<MovieDto>()
            .ToTable("Movie", schema: "movie");
        
        builder.Entity<MovieDto>()
            .HasKey(m => m.MovieId)
            .HasName("PK_Movie_Movie");
        
        builder.Entity<MovieDto>()
            .Property(m => m.Title)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Entity<MovieDto>()
            .Property(m => m.ImdbLink)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<MovieDto>()
            .Property(m => m.Rating)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Entity<MovieDto>()
            .Property(m => m.Thoughts)
            .HasMaxLength(2000)
            .IsRequired()
            .HasDefaultValue("");
        
        builder.Entity<MovieDto>()
            .Property(m => m.PosterImageUrl)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<MovieDto>()
            .HasOne(m => m.MovieStatus)
            .WithMany(ms => ms.Movies)
            .HasForeignKey(m => m.MovieStatusId);
        #endregion "Movie"
        
        #region "MovieGenre"
        builder.Entity<MovieGenreDto>()
            .ToTable("MovieGenre", schema: "movie");
        
        builder.Entity<MovieGenreDto>()
            .HasKey(mg => mg.MovieGenreId)
            .HasName("PK_Movie_MovieGenre");
        
        builder.Entity<MovieGenreDto>()
            .Property(mg => mg.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<MovieGenreDto>()
            .Property(mg => mg.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "MovieGenre"
        
        #region "MovieService"
        builder.Entity<MovieServiceDto>()
            .ToTable("MovieService", schema: "movie");
        
        builder.Entity<MovieServiceDto>()
            .HasKey(ms => ms.MovieServiceId)
            .HasName("PK_Movie_MovieService");
        
        builder.Entity<MovieServiceDto>()
            .Property(ms => ms.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<MovieServiceDto>()
            .Property(ms => ms.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "MovieService"
        
        #region "MovieStatus"
        builder.Entity<MovieStatusDto>()
            .ToTable("MovieStatus", schema: "movie");
        
        builder.Entity<MovieStatusDto>()
            .HasKey(ms => ms.MovieStatusId)
            .HasName("PK_Movie_MovieStatus");
        
        builder.Entity<MovieStatusDto>()
            .Property(ms => ms.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<MovieStatusDto>()
            .Property(ms => ms.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "MovieStatus"

        #region "MovieToMovieGenre"
        builder.Entity<MovieToMovieGenreDto>()
            .ToTable("MovieToMovieGenre", schema: "movie");
        
        builder.Entity<MovieToMovieGenreDto>()
            .HasKey(mg => mg.MovieToMovieGenreId)
            .HasName("PK_Movie_MovieToMovieGenre");
        
        builder.Entity<MovieToMovieGenreDto>()
            .HasIndex(mg => new { mg.MovieId, mg.MovieGenreId })
            .HasDatabaseName("UQ_Movie_MovieToMovieGenre_MovieId_MovieGenreId")
            .IsUnique();
        
        builder.Entity<MovieToMovieGenreDto>()
            .HasOne(mg => mg.Movie)
            .WithMany(m => m.MovieToMovieGenres)
            .HasForeignKey(mg => mg.MovieId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<MovieToMovieGenreDto>()
            .HasOne(mg => mg.MovieGenre)
            .WithMany(g => g.MovieToMovieGenres)
            .HasForeignKey(mg => mg.MovieGenreId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "MovieToMovieGenre"
        
        #region "MovieToMovieService"
        builder.Entity<MovieToMovieServiceDto>()
            .ToTable("MovieToMovieService", schema: "movie");
        
        builder.Entity<MovieToMovieServiceDto>()
            .HasKey(ms => ms.MovieToMovieServicId)
            .HasName("PK_Movie_MovieToMovieService");
        
        builder.Entity<MovieToMovieServiceDto>()
            .HasIndex(ms => new { ms.MovieId, ms.MovieServiceId })
            .HasDatabaseName("UQ_Movie_MovieToMovieService_MovieId_MovieServiceId")
            .IsUnique();
        
        builder.Entity<MovieToMovieServiceDto>()
            .HasOne(ms => ms.Movie)
            .WithMany(m => m.MovieToMovieServices)
            .HasForeignKey(ms => ms.MovieId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<MovieToMovieServiceDto>()
            .HasOne(ms => ms.MovieService)
            .WithMany(s => s.MovieToMovieService)
            .HasForeignKey(ms => ms.MovieServiceId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "MovieToMovieService"

        #endregion "Movies"
        
        #region "Music"
        
        #region "Album"
        builder.Entity<MusicAlbumDto>()
            .ToTable("MusicAlbum", schema: "music");
        
        builder.Entity<MusicAlbumDto>()
            .HasKey(m => m.MusicAlbumId)
            .HasName("PK_Music_MusicAlbum");
        
        builder.Entity<MusicAlbumDto>()
            .Property(m => m.Title)
            .HasMaxLength(150)
            .IsRequired();
        
        builder.Entity<MusicAlbumDto>()
            .Property(m => m.Artist)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Entity<MusicAlbumDto>()
            .Property(m => m.IsTopTen)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Entity<MusicAlbumDto>()
            .Property(m => m.Thoughts)
            .HasMaxLength(2000)
            .IsRequired()
            .HasDefaultValue("");
        
        builder.Entity<MusicAlbumDto>()
            .Property(m => m.CoverImageUrl)
            .HasMaxLength(255)
            .IsRequired();
        #endregion "Album"
        
        #region "Track"
        builder.Entity<MusicAlbumTrackDto>()
            .ToTable("MusicAlbumTrack", schema: "music");
        
        builder.Entity<MusicAlbumTrackDto>()
            .HasKey(m => m.MusicAlbumTrackId)
            .HasName("PK_Music_MusicAlbumTrack");
        
        builder.Entity<MusicAlbumTrackDto>()
            .Property(m => m.Title)
            .HasMaxLength(150)
            .IsRequired();

        builder.Entity<MusicAlbumTrackDto>()
            .Property(m => m.TrackNumber)
            .IsRequired()
            .HasDefaultValue(0);
        
        builder.Entity<MusicAlbumTrackDto>()
            .HasOne(m => m.MusicAlbum)
            .WithMany(ma => ma.MusicAlbumTracks)
            .HasForeignKey(m => m.MusicAlbumId);
        #endregion "Track"
                
        #region "MusicGenre"
        builder.Entity<MusicGenreDto>()
            .ToTable("MusicGenre", schema: "music");
        
        builder.Entity<MusicGenreDto>()
            .HasKey(mg => mg.MusicGenreId)
            .HasName("PK_Music_Genre");
        
        builder.Entity<MusicGenreDto>()
            .Property(mg => mg.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<MusicGenreDto>()
            .Property(mg => mg.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "MusicGenre"
        
        #region "MusicFormat"
        builder.Entity<MusicFormatDto>()
            .ToTable("MusicFormat", schema: "music");
        
        builder.Entity<MusicFormatDto>()
            .HasKey(mf => mf.MusicFormatId)
            .HasName("PK_Music_MusicFormat");
        
        builder.Entity<MusicFormatDto>()
            .Property(mf => mf.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<MusicFormatDto>()
            .Property(mf => mf.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "MusicFormat"

        #region "AlbumToGenre"
        builder.Entity<MusicAlbumToMusicGenreDto>()
            .ToTable("MusicAlbumToMusicGenre", schema: "music");
        
        builder.Entity<MusicAlbumToMusicGenreDto>()
            .HasKey(m => m.MusicAlbumToMusicGenreId)
            .HasName("PK_Music_MusicAlbumToMusicGenre");
        
        builder.Entity<MusicAlbumToMusicGenreDto>()
            .HasIndex(mg => new { mg.MusicAlbumId, mg.MusicGenreId })
            .HasDatabaseName("UQ_Music_MusicAlbumToMusicGenre_MusicAlbumId_MusicGenreId")
            .IsUnique();
        
        builder.Entity<MusicAlbumToMusicGenreDto>()
            .HasOne(mg => mg.MusicAlbum)
            .WithMany(m => m.MusicAlbumToMusicGenres)
            .HasForeignKey(mg => mg.MusicAlbumId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<MusicAlbumToMusicGenreDto>()
            .HasOne(mg => mg.MusicGenre)
            .WithMany(g => g.MusicAlbumToMusicGenres)
            .HasForeignKey(mg => mg.MusicGenreId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "AlbumToGenre"
        
        #region "AlbumToFormat"
        builder.Entity<MusicAlbumToMusicFormatDto>()
            .ToTable("MusicAlbumToMusicFormat", schema: "music");
        
        builder.Entity<MusicAlbumToMusicFormatDto>()
            .HasKey(mf => mf.MusicAlbumToMusicFormatId)
            .HasName("PK_Music_MusicAlbumToMusicFormat");
        
        builder.Entity<MusicAlbumToMusicFormatDto>()
            .HasIndex(mf => new { mf.MusicAlbumId, mf.MusicFormatId })
            .HasDatabaseName("UQ_Music_MusicAlbumToMusicFormat_MusicAlbumId_MusicFormatId")
            .IsUnique();
        
        builder.Entity<MusicAlbumToMusicFormatDto>()
            .HasOne(mf => mf.MusicAlbum)
            .WithMany(m => m.MusicAlbumToMusicFormats)
            .HasForeignKey(mf => mf.MusicAlbumId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<MusicAlbumToMusicFormatDto>()
            .HasOne(mf => mf.MusicFormat)
            .WithMany(f => f.MusicAlbumToMusicFormats)
            .HasForeignKey(mf => mf.MusicFormatId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "AlbumToFormat"
        
        #endregion "Music"
        
        #region "Podcasts"

        #region "Podcast"
        builder.Entity<PodcastDto>()
            .ToTable("Podcast", schema: "podcast");
        
        builder.Entity<PodcastDto>()
            .HasKey(p => p.PodcastId)
            .HasName("PK_Podcast_Podcast");
        
        builder.Entity<PodcastDto>()
            .Property(p => p.Name)
            .HasMaxLength(150)
            .IsRequired();
        
        builder.Entity<PodcastDto>()
            .Property(p => p.Link)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<PodcastDto>()
            .Property(m => m.CoverImageUrl)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<PodcastDto>()
            .HasOne(p => p.PodcastCategory)
            .WithMany(pc => pc.Podcasts)
            .HasForeignKey(p => p.PodcastCategoryId);
        #endregion "Podcast"
        
        #region "PodcastCategory"
        builder.Entity<PodcastCategoryDto>()
            .ToTable("PodcastCategory", schema: "podcast");
        
        builder.Entity<PodcastCategoryDto>()
            .HasKey(pc => pc.PodcastCategoryId)
            .HasName("PK_Podcast_PodcastCategory");
        
        builder.Entity<PodcastCategoryDto>()
            .Property(pc => pc.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<PodcastCategoryDto>()
            .Property(pc => pc.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "PodcastCategory"

        #endregion "Podcasts"
        
        #region "Television"
        
        #region "Show"
        builder.Entity<TelevisionShowDto>()
            .ToTable("TelevisionShow", schema: "tv");
        
        builder.Entity<TelevisionShowDto>()
            .HasKey(t => t.TelevisionShowId)
            .HasName("PK_Tv_TelevisionShow");
        
        builder.Entity<TelevisionShowDto>()
            .Property(t => t.Title)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Entity<TelevisionShowDto>()
            .Property(t => t.ImdbLink)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<TelevisionShowDto>()
            .Property(t => t.Rating)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Entity<TelevisionShowDto>()
            .Property(t => t.Thoughts)
            .HasMaxLength(2000)
            .IsRequired()
            .HasDefaultValue("");
        
        builder.Entity<TelevisionShowDto>()
            .Property(t => t.CoverImageUrl)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<TelevisionShowDto>()
            .Property(t => t.CurrentSeason)
            .IsRequired()
            .HasDefaultValue(0);
        
        builder.Entity<TelevisionShowDto>()
            .HasOne(t => t.TelevisionStatus)
            .WithMany(ts => ts.TelevisionShows)
            .HasForeignKey(t => t.TelevisionStatusId);
        #endregion "Show"
        
        #region "TelevisionStatus"
        builder.Entity<TelevisionStatusDto>()
            .ToTable("TelevisionStatus", schema: "tv");
        
        builder.Entity<TelevisionStatusDto>()
            .HasKey(ts => ts.TelevisionStatusId)
            .HasName("PK_Tv_TelevisionStatus");
        
        builder.Entity<TelevisionStatusDto>()
            .Property(ts => ts.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<TelevisionStatusDto>()
            .Property(ts => ts.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "TelevisionStatus"
        
        #region "TelevisionService"
        builder.Entity<TelevisionServiceDto>()
            .ToTable("TelevisionService", schema: "tv");
        
        builder.Entity<TelevisionServiceDto>()
            .HasKey(ts => ts.TelevisionServiceId)
            .HasName("PK_Tv_TelevisionService");
        
        builder.Entity<TelevisionServiceDto>()
            .Property(ts => ts.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<TelevisionServiceDto>()
            .Property(ts => ts.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "TelevisionService"
        
        #region "TelevisionGenre"
        builder.Entity<TelevisionGenreDto>()
            .ToTable("TelevisionGenre", schema: "tv");
        
        builder.Entity<TelevisionGenreDto>()
            .HasKey(tg => tg.TelevisionGenreId)
            .HasName("PK_Tv_TelevisionGenre");
        
        builder.Entity<TelevisionGenreDto>()
            .Property(tg => tg.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<TelevisionGenreDto>()
            .Property(tg => tg.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "TelevisionGenre"

        #region "ShowToGenre"
        builder.Entity<TelevisionShowToTelevisionGenreDto>()
            .ToTable("TelevisionShowToTelevisionGenre", schema: "tv");
        
        builder.Entity<TelevisionShowToTelevisionGenreDto>()
            .HasKey(tg => tg.TelevisionShowToTelevisionGenreId)
            .HasName("PK_Tv_TelevisionShowToTelevisionGenre");
        
        builder.Entity<TelevisionShowToTelevisionGenreDto>()
            .HasIndex(tg => new { tg.TelevisionShowId, tg.TelevisionGenreId })
            .HasDatabaseName("UQ_Tv_TelevisionShowToTelevisionGenre_TelevisionShowId_TelevisionGenreId")
            .IsUnique();
        
        builder.Entity<TelevisionShowToTelevisionGenreDto>()
            .HasOne(tg => tg.TelevisionShow)
            .WithMany(t => t.TelevisionToTelevisionGenres)
            .HasForeignKey(tg => tg.TelevisionShowId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<TelevisionShowToTelevisionGenreDto>()
            .HasOne(tg => tg.TelevisionGenre)
            .WithMany(g => g.TelevisionShowToTelevisionGenres)
            .HasForeignKey(tg => tg.TelevisionGenreId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "ShowToGenre"
        
        #region "ShowToService"
        builder.Entity<TelevisionShowToTelevisionServiceDto>()
            .ToTable("TelevisionShowToTelevisionService", schema: "tv");
        
        builder.Entity<TelevisionShowToTelevisionServiceDto>()
            .HasKey(ts => ts.TelevisionShowToTelevisionServiceId)
            .HasName("PK_Tv_TelevisionShowToTelevisionService");
        
        builder.Entity<TelevisionShowToTelevisionServiceDto>()
            .HasIndex(ts => new { ts.TelevisionShowId, ts.TelevisionServiceId })
            .HasDatabaseName("UQ_Music_TelevisionShowToTelevisionService_TelevisionShowId_TelevisionServiceId")
            .IsUnique();
        
        builder.Entity<TelevisionShowToTelevisionServiceDto>()
            .HasOne(ts => ts.TelevisionShow)
            .WithMany(t => t.TelevisionToTelevisionServices)
            .HasForeignKey(ts => ts.TelevisionShowId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<TelevisionShowToTelevisionServiceDto>()
            .HasOne(ts => ts.TelevisionService)
            .WithMany(s => s.TelevisionShowToTelevisionServices)
            .HasForeignKey(ts => ts.TelevisionServiceId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "ShowToService"
        
        #endregion "Television"
        
        #region "Video Games"
        
        #region "VideoGame"
        builder.Entity<VideoGameDto>()
            .ToTable("VideoGame", schema: "videogame");
        
        builder.Entity<VideoGameDto>()
            .HasKey(v => v.VideoGameId)
            .HasName("PK_Videogame_VideoGme");
        
        builder.Entity<VideoGameDto>()
            .Property(v => v.Title)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Entity<VideoGameDto>()
            .Property(v => v.Link)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<VideoGameDto>()
            .Property(v => v.Rating)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Entity<VideoGameDto>()
            .Property(v => v.Thoughts)
            .HasMaxLength(2000)
            .IsRequired()
            .HasDefaultValue("");
        
        builder.Entity<VideoGameDto>()
            .Property(v => v.CoverImageUrl)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Entity<VideoGameDto>()
            .HasOne(v => v.VideoGameStatus)
            .WithMany(vs => vs.VideoGames)
            .HasForeignKey(v => v.VideoGameStatusId);
        
        builder.Entity<VideoGameDto>()
            .HasOne(v => v.VideoGameCompletion)
            .WithMany(vc => vc.VideoGames)
            .HasForeignKey(v => v.VideoGameCompletionId);
        #endregion "VideoGame"
        
        #region "VideoGameCompletion"
        builder.Entity<VideoGameCompletionDto>()
            .ToTable("VideoGameCompletion", schema: "videogame");
        
        builder.Entity<VideoGameCompletionDto>()
            .HasKey(vc => vc.VideoGameCompletionId)
            .HasName("PK_Videogame_VideoGameCompletion");
        
        builder.Entity<VideoGameCompletionDto>()
            .Property(vc => vc.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<VideoGameCompletionDto>()
            .Property(vc => vc.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "PodcastCategory"
        
        #region "VideoGameGenre"
        builder.Entity<VideoGameGenreDto>()
            .ToTable("VideoGameGenre", schema: "videogame");
        
        builder.Entity<VideoGameGenreDto>()
            .HasKey(vg => vg.VideoGameGenreId)
            .HasName("PK_Videogame_VideoGameGenre");
        
        builder.Entity<VideoGameGenreDto>()
            .Property(vg => vg.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<VideoGameGenreDto>()
            .Property(vg => vg.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "VideoGameGenre"
        
        #region "VideoGameStatus"
        builder.Entity<VideoGameStatusDto>()
            .ToTable("VideoGameStatus", schema: "videogame");
        
        builder.Entity<VideoGameStatusDto>()
            .HasKey(vs => vs.VideoGameStatusId)
            .HasName("PK_Videogame_VideoGameStatus");
        
        builder.Entity<VideoGameStatusDto>()
            .Property(vs => vs.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<VideoGameStatusDto>()
            .Property(vs => vs.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "VideoGameStatus"
        
        #region "VideoGameSystem"
        builder.Entity<VideoGameSystemDto>()
            .ToTable("VideoGameSystem", schema: "videogame");
        
        builder.Entity<VideoGameSystemDto>()
            .HasKey(vs => vs.VideoGameSystemId)
            .HasName("PK_Videogame_VideoGameSystem");
        
        builder.Entity<VideoGameSystemDto>()
            .Property(vs => vs.Name)
            .HasMaxLength(25)
            .IsRequired();
        
        builder.Entity<VideoGameSystemDto>()
            .Property(vs => vs.ColorCode)
            .HasMaxLength(25)
            .HasDefaultValue("");
        #endregion "VideoGameSystem"

        #region "VideoGameToGenre"
        builder.Entity<VideoGameToVideoGameGenreDto>()
            .ToTable("VideoGameToVideoGameGenre", schema: "videogame");
        
        builder.Entity<VideoGameToVideoGameGenreDto>()
            .HasKey(vg => vg.VideoGameToVideoGameGenreId)
            .HasName("PK_Videogame_VideoGameToVideoGameGenre");
        
        builder.Entity<VideoGameToVideoGameGenreDto>()
            .HasIndex(vg => new { vg.VideoGameId, vg.VideoGameGenreId })
            .HasDatabaseName("UQ_Videogame_VideoGameToVideoGameGenre_VideoGameId_VideoGameGenreId")
            .IsUnique();
        
        builder.Entity<VideoGameToVideoGameGenreDto>()
            .HasOne(vg => vg.VideoGame)
            .WithMany(v => v.VideoGameToVideoGameGenres)
            .HasForeignKey(vg => vg.VideoGameId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<VideoGameToVideoGameGenreDto>()
            .HasOne(vg => vg.VideoGameGenre)
            .WithMany(g => g.VideoGameToVideoGameGenres)
            .HasForeignKey(vg => vg.VideoGameGenreId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "VideoGameToGenre"
        
        #region "VideoGameToSystem"
        builder.Entity<VideoGameToVideoGameSystemDto>()
            .ToTable("VideoGameToVideoGameSystem", schema: "videogame");
        
        builder.Entity<VideoGameToVideoGameSystemDto>()
            .HasKey(vs => vs.VideoGameToVideoGameSystemId)
            .HasName("PK_Videogame_VideoGameToVideoGameSystem");
        
        builder.Entity<VideoGameToVideoGameSystemDto>()
            .HasIndex(vs => new { vs.VideoGameId, vs.VideoGameSystemId })
            .HasDatabaseName("UQ_Videogame_VideoGameToVideoGameSystem_VideoGameId_VideoGameSystemId")
            .IsUnique();
        
        builder.Entity<VideoGameToVideoGameSystemDto>()
            .HasOne(vs => vs.VideoGame)
            .WithMany(v => v.VideoGameToVideoGameSystems)
            .HasForeignKey(vs => vs.VideoGameId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<VideoGameToVideoGameSystemDto>()
            .HasOne(vs => vs.VideoGameSystem)
            .WithMany(s => s.VideoGameToVideoGameSystems)
            .HasForeignKey(vs => vs.VideoGameSystemId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion "VideoGameToSystem"
        
        #endregion "VideoGames"
    }
}