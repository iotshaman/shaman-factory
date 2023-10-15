using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shaman.CommandLineUtility.Commands;
using Shaman.CommandLineUtility.Configuration;
using System;
using System.IO;

namespace Shaman.CommandLineUtility.Composition;

internal static class ServiceCollectionExtensions
{
    public static IServiceCollection AddConfiguration(this IServiceCollection services)
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetParent(AppContext.BaseDirectory).FullName)
            .AddJsonFile("appsettings.json", false);

        var configuration = builder.Build();
        services.Configure<AppConfig>(o => configuration.GetSection("AppConfig").Bind(o));
        return services;
    }

    public static IServiceCollection AddCommands(this IServiceCollection services)
    {
        services.AddTransient<ICommand, MenuCommand>();
        services.AddTransient<ICommand, EchoCommand>();

        return services;
    }

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        

        return services;
    }
}
