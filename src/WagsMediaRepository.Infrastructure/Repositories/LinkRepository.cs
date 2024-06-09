using System.Linq;
using Microsoft.EntityFrameworkCore;
using WagsMediaRepository.Application.Repositories;
using WagsMediaRepository.Domain.Dtos;
using WagsMediaRepository.Domain.Exceptions;
using WagsMediaRepository.Infrastructure.Database;

namespace WagsMediaRepository.Infrastructure.Repositories;

public class LinkRepository(IDbContextFactory<ApplicationDbContext> contextFactory) : ILinkRepository
{
    #region "Link Types"
    public async Task<List<LinkType>> GetLinkTypesAsync()
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var linkTypes = await dbContext.LinkTypes
            .Include(l => l.Links)
            .ToListAsync();

        return linkTypes
            .OrderBy(l => l.Name)
            .Select(LinkType.FromDto)
            .ToList();
    }

    public async Task<LinkType?> GetLinkTypeByIdAsync(int linkTypeId)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var linkType = await dbContext.LinkTypes.FindAsync(linkTypeId);

        return linkType is not null ? LinkType.FromDto(linkType) : null;
    }

    public async Task<LinkType> AddLinkTypeAsync(LinkType linkType)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var newLinkType = new LinkTypeDto
        {
            Name = linkType.Name,
            ColorCode = linkType.ColorCode,
        };

        dbContext.LinkTypes.Add(newLinkType);

        await dbContext.SaveChangesAsync();

        return LinkType.FromDto(newLinkType);
    }

    public async Task<LinkType> UpdateLinkTypeAsync(LinkType linkType)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var type = await dbContext.LinkTypes.FindAsync(linkType.LinkTypeId);

        if (type is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link type");
        }

        type.Name = linkType.Name;
        type.ColorCode = linkType.ColorCode;

        dbContext.LinkTypes.Update(type);

        await dbContext.SaveChangesAsync();
        
        return LinkType.FromDto(type);
    }

    public async Task DeleteLinkTypeAsync(int linkTypeId)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.LinkTypes.Where(lt => lt.LinkTypeId == linkTypeId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Link Types"

    #region "Link Categories"
    public async Task<List<LinkCategory>> GetLinkCategoriesAsync()
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var linkCategories = await dbContext.LinkCategories.ToListAsync();

        return linkCategories
            .OrderBy(l => l.Name)
            .Select(LinkCategory.FromDto)
            .ToList();
    }

    public async Task<LinkCategory?> GetLinkCategoryByIdAsync(int linkCategoryId)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var linkCategory = await dbContext.LinkCategories.FindAsync(linkCategoryId);

        return linkCategory is not null ? LinkCategory.FromDto(linkCategory) : null;
    }

    public async Task<LinkCategory> AddLinkCategoryAsync(LinkCategory linkCategory)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();
        
        var newLinkCategory = new LinkCategoryDto()
        {
            Name = linkCategory.Name,
            ColorCode = linkCategory.ColorCode,
        };

        dbContext.LinkCategories.Add(newLinkCategory);

        await dbContext.SaveChangesAsync();

        return LinkCategory.FromDto(newLinkCategory);
    }

    public async Task<LinkCategory> UpdateLinkCategoryAsync(LinkCategory linkCategory)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();
        
        var category = await dbContext.LinkCategories.FindAsync(linkCategory.LinkCategoryId);

        if (category is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link category");
        }

        category.Name = linkCategory.Name;
        category.ColorCode = linkCategory.ColorCode;

        dbContext.LinkCategories.Update(category);

        await dbContext.SaveChangesAsync();
        
        return LinkCategory.FromDto(category);
    }

    public async Task DeleteLinkCategoryAsync(int linkCategoryId)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.LinkCategories.Where(lc => lc.LinkCategoryId == linkCategoryId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Link Categories"

    #region "Links"
    public async Task<List<Link>> GetLinksAsync()
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var links = await dbContext.Links
            .Include(l => l.LinkCategory)
            .Include(l => l.LinkType)
            .ToListAsync();

        return links
            .OrderByDescending(l => l.LinkDate)
            .Select(Link.FromDto)
            .ToList();
    }

    public async Task<Link?> GetLinkByIdAsync(int linkId)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var link = await dbContext.Links.FindAsync(linkId);

        return link is not null ? Link.FromDto(link) : null;
    }

    public async Task<Link> AddLinkAsync(Link link)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();

        var linkType = await dbContext.LinkTypes.FindAsync(link.LinkTypeId);
        
        if (linkType is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link type");
        }
        
        var linkCategory = await dbContext.LinkCategories.FindAsync(link.LinkCategoryId);
        
        if (linkCategory is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link category");
        }
        
        var newLink = new LinkDto
        {
            LinkType = linkType,
            LinkCategory = linkCategory,
            Title = link.Title,
            Url = link.Url,
            Author = link.Author,
            LinkDate = link.LinkDate,
            ReadingLogIssueNumber = link.ReadingLogIssueNumber,
        };

        dbContext.Links.Add(newLink);

        await dbContext.SaveChangesAsync();

        return Link.FromDto(newLink);
    }

    public async Task<Link> UpdateLinkAsync(Link link)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();
        
        var updatedLink = await dbContext.Links.FindAsync(link.LinkId);

        if (updatedLink is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link");
        }
        
        var linkType = await dbContext.LinkTypes.FindAsync(link.LinkTypeId);
        
        if (linkType is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link type");
        }
        
        var linkCategory = await dbContext.LinkCategories.FindAsync(link.LinkCategoryId);
        
        if (linkCategory is null)
        {
            throw new ObjectNotFoundException("Unable to find the specified link category");
        }

        updatedLink.LinkType = linkType;
        updatedLink.LinkCategory = linkCategory;
        updatedLink.Title = link.Title;
        updatedLink.Url = link.Url;
        updatedLink.Author = link.Author;
        updatedLink.LinkDate = link.LinkDate;
        updatedLink.ReadingLogIssueNumber = link.ReadingLogIssueNumber;

        dbContext.Links.Update(updatedLink);

        await dbContext.SaveChangesAsync();
        
        return Link.FromDto(updatedLink);
    }

    public async Task DeleteLinkAsync(int linkId)
    {
        var dbContext = await contextFactory.CreateDbContextAsync();
        
        await dbContext.Links.Where(l => l.LinkId == linkId).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
    #endregion "Links
}