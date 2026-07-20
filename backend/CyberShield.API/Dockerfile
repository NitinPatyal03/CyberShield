# Build Stage
using Org.BouncyCastle.Bcpg;
using static System.Net.WebRequestMethods;

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .

WORKDIR /src/backend

RUN dotnet restore CyberShield.sln

RUN dotnet publish CyberShield.API/CyberShield.API.csproj \
    -c Release \
    -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "CyberShield.API.dll"]# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .

WORKDIR /src/backend

RUN dotnet restore CyberShield.sln

RUN dotnet publish CyberShield.API/CyberShield.API.csproj \
    -c Release \
    -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "CyberShield.API.dll"]