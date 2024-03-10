FROM mcr.microsoft.com/dotnet/sdk as build
COPY . ./src
WORKDIR /src
RUN dotnet build -o /app
RUN dotnet publish -o /publish
 
FROM mcr.microsoft.com/dotnet/aspnet:8.0 as base
COPY --from=build  /publish /app
WORKDIR /app
EXPOSE 8080
CMD ["./FamTreeApi", "--server.urls", "http://0.0.0.0:8080/"]
