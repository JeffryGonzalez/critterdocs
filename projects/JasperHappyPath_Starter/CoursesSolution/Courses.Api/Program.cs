using System.Text.Json.Serialization;
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

builder.Services.AddMarten(config =>
    {
        var connectionString = builder.Configuration.GetConnectionString("db") ??
                               throw new Exception("Connection string not found");
        config.Connection(connectionString);

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