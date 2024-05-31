using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WagsMediaRepository.Infrastructure.Database;
using WagsMediaRepository.Web.Components;
using WagsMediaRepository.Web.Configuration;
using WagsMediaRepository.Web.Extensions;

var configuration = new WagsMediaConfiguration();

var builder = WebApplication.CreateBuilder(args);

// Build configuration
var baseDirectory = Directory.GetParent(AppContext.BaseDirectory);
var environment = builder.Environment;

if (baseDirectory is null)
{
    throw new Exception("Unable to read base directory");
}

var config = new ConfigurationBuilder()
    .SetBasePath(baseDirectory.FullName)
    .AddJsonFile("appsettings.json", false)
    .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", false)
    .Build();

config.Bind(configuration);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton(configuration);

builder.Services.AddDbContextFactory<ApplicationDbContext>(opt =>
    opt.UseSqlite(config.GetConnectionString("RepoDb"), b => b.MigrationsAssembly("WagsMediaRepository.Web")));

builder.Services.AddRepositories();
builder.Services.AddServices();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
