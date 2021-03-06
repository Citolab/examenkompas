using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace Citolab.Examenkompas.Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
      Host.CreateDefaultBuilder(args)
       .ConfigureAppConfiguration((hostingContext, config) =>
       {
           config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: false);
           config.AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true);
           config.AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json", optional: true);
           config.AddEnvironmentVariables();
       })
          .ConfigureWebHostDefaults(webBuilder =>
          {
              webBuilder.UseStartup<Startup>();
          });
    }
}
