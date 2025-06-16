using System.Text.Json.Serialization;
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
    })
    .IntegrateWithWolverine()
    .UseLightweightSessions();

builder.Services.AddWolverineHttp();

var app = builder.Build();

app.MapWolverineEndpoints();

// The frontend app is served from the "app" directory in the wwwroot folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.WebRootPath, "app")),
    RequestPath = "/app",
});

// Serve the index.html file for any unmatched requests under /app
app.MapWhen(context => context.Request.Path.StartsWithSegments("/app"), appBuilder =>
{
    appBuilder.UseRouting();
    appBuilder.UseEndpoints(endpoints =>     {         
        endpoints.MapFallbackToFile("app/index.html");     
    }); 
});

// Send a 404 response for any unmatched API requests instead of serving index.html
app.Map("/api/{*:}", Results.NotFound);

app.Run();