using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Shaman.CsharpServer.Configuration;
using System.Diagnostics.CodeAnalysis;
//shaman: {"lifecycle": "transformation", "args": {"type": "import", "target": "*"}}

namespace Shaman.CsharpServer.Composition;

[ExcludeFromCodeCoverage]
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, string policyName)
    {
        var corsBuilder = new CorsPolicyBuilder()
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();

        services.AddCors(options => { options.AddPolicy(policyName, corsBuilder.Build()); });

        return services;
    }

    public static IServiceCollection AddConfiguration(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<AppConfig>(o => configuration.GetSection("AppConfig").Bind(o));
        return services;
    }

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        //shaman: {"lifecycle": "transformation", "args": {"type": "compose", "target": "datacontext"}}
        return services;
    }

    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Documentation", Version = "v1" });
        });

        return services;
    }
}
