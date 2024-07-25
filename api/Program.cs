using System.Net;
using Microsoft.AspNetCore.HttpOverrides;

namespace api;

internal static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddMvc();
        builder.Services.Configure<ForwardedHeadersOptions>(options => { options.KnownProxies.Add(IPAddress.Parse("10.0.0.100")); });

        var app = builder.Build();

        if (!app.Environment.IsDevelopment())
        {
            app.UseHsts();
        }


        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        });

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Status}/{action=Index}/{id?}");

        app.Run();
    }
}