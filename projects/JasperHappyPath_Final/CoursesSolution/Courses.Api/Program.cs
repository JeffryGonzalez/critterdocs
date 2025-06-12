using System.Text.Json.Serialization;
using Courses.Api.Courses;
using JasperFx.Events.Projections;
using Marten;
using Microsoft.Extensions.FileProviders;
using Wolverine;
using Wolverine.Http;
using Wolverine.Marten;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureSystemTextJsonForWolverineOrMinimalApi(o =>
{

    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    
});
builder.Host.UseWolverine(options =>
{
    options.Policies.AutoApplyTransactions();
});
builder.Services.AddDirectoryBrowser();
builder.Services.AddMarten(config =>
    {
        var connectionString = builder.Configuration.GetConnectionString("db") ??
                               throw new Exception("Connection string not found");
        config.Connection(connectionString);

        config.Projections.Add<CourseProjection>(ProjectionLifecycle.Inline);
        config.Projections.Add<CourseHistoryProjection>(ProjectionLifecycle.Inline);
    }).IntegrateWithWolverine()
    .UseLightweightSessions();

builder.Services.AddWolverineHttp();

builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
var app = builder.Build();



if (app.Environment.EnvironmentName == "Frontend")
{
    app.MapReverseProxy();
}
else
{
    app.UseDefaultFiles();

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.WebRootPath, "app")),
        RequestPath = "/app"
    });
}

app.MapWolverineEndpoints();

app.Run();