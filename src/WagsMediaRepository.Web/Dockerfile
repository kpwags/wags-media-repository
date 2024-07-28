FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["WagsMediaRepository.Web/WagsMediaRepository.Web.csproj", "WagsMediaRepository.Web/"]
COPY ["WagsMediaRepository.Application/WagsMediaRepository.Application.csproj", "WagsMediaRepository.Application/"]
COPY ["WagsMediaRepository.Domain/WagsMediaRepository.Domain.csproj", "WagsMediaRepository.Domain/"]
COPY ["WagsMediaRepository.Infrastructure/WagsMediaRepository.Infrastructure.csproj", "WagsMediaRepository.Infrastructure/"]
RUN dotnet restore "WagsMediaRepository.Web/WagsMediaRepository.Web.csproj"
COPY . .
WORKDIR /"src/WagsMediaRepository.Web"
RUN dotnet build "WagsMediaRepository.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WagsMediaRepository.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WagsMediaRepository.Web.dll"]