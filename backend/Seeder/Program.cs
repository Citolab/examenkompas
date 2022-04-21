using System;
using System.Collections.Generic;
using System.IO;
using Citolab.Examenkompas.Models;
using Citolab.Persistence.Extensions;
using Citolab.Persistence.MongoDb;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace Citolab.Examenkompas.Seeder
{
    class Program
    {
        public static IConfigurationRoot Configuration { get; set; }
        static void Main()
        {

            Console.WriteLine("Seeding Examenkompas..");
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (string.IsNullOrWhiteSpace(environment))
                throw new Exception("Environment not found in ASPNETCORE_ENVIRONMENT");
            Console.WriteLine("Environment: {0}", environment);
            if (environment.ToLower() == "production")
            {
                Console.Write("Environment to be seeded is Production, ARE YOU SURE? (y/n)");
                var sureKey = Console.ReadKey();
                if (sureKey.KeyChar != 'y' && sureKey.KeyChar != 'Y')
                {
                    Console.WriteLine("Aborted. Exiting..");
                    return;
                }
            }

            var builder = new ConfigurationBuilder()
                           .SetBasePath(Directory.GetCurrentDirectory())
                           .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                           .AddJsonFile($"appsettings.local.json", optional: true)
                           .AddEnvironmentVariables()
                           ;
            Configuration = builder.Build();
          
             var mongoDbConnectionString = Configuration.GetConnectionString("MongoDB");
         

            var forceSeedOnExistingDatabase = Configuration.GetValue<bool>("AppSettings:forceSeedOnExistingDatabase");
            Console.WriteLine($"Force seed on existing database: {forceSeedOnExistingDatabase}");
            if (forceSeedOnExistingDatabase)
            {
                Console.Write("Forcing seed even when the database is not empty, ARE YOU SURE? (y/n)");
                var sureKey = Console.ReadKey();
                if (sureKey.KeyChar != 'y' && sureKey.KeyChar != 'Y')
                {
                    Console.WriteLine("Aborted. Exiting..");
                    return;
                }
            }

            BsonSerializer.RegisterSerializer(typeof(DateTime), DateTimeSerializer.LocalInstance);

            // Setting up DI
            var services = new ServiceCollection();
            services.AddMemoryCache();
            var database = Configuration.GetValue<string>("AppSettings:database");
            if (database.Equals("mongo", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine($"mongoDB connectionstring: {mongoDbConnectionString}");
                var options = new MongoDbDatabaseOptions("Examenkompas", mongoDbConnectionString
                    , new List<Type> { typeof(Examen), typeof(ExamenAnalysisMetadata), typeof(ClustersPerNiveau) })
                {
                    FlagDelete = false
                };
                services.AddMongoDbPersistence(options);
            }
            else if (database.Equals("memory", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine($"using inmemory database");
                services.AddInMemoryPersistence();
            }
            else
                // services.AddMongoDbPersistence("Examenkompas", mongoDbConnectionString);

                services.AddLogging(l =>
            {
                l.AddConfiguration(Configuration.GetSection("Logging"));
                l.ClearProviders().AddConsole().AddDebug();
            });
            services.AddSingleton<Seed>();

            var serviceProvider = services.BuildServiceProvider();
            var seed = serviceProvider.GetService<Seed>();
             seed.Run().Wait();

            Console.WriteLine("Finished seeding. Press a key to exit.");
            Console.ReadLine();
        }
    }
}

