using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Citolab.Persistence.Extensions;
using Citolab.Examenkompas.Backend.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;
using ReturnTrue.AspNetCore.Identity.Anonymous;
using Citolab.Examenkompas.Models;

namespace Citolab.Examenkompas.Backend
{
    public class Startup
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            AddControllerStuff(services);
            AddSwagger(services);
            AddPersistence(services);
            services.AddApplicationInsightsTelemetry(_configuration["APPINSIGHTS_CONNECTIONSTRING"]);
        }

        private void AddControllerStuff(IServiceCollection services)
        {
            services.AddResponseCompression();
            services.AddLogging(builder =>
            {
                builder.AddConfiguration(_configuration.GetSection("Logging"));
                builder.AddConsole();
                builder.AddDebug();
            });

            services.AddControllers(options =>
            {
                options.Filters.Add(typeof(DomainExceptionFilter));
                options.AllowEmptyInputInBodyModelBinding = true;
            });
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "wwwroot"; });
            services.AddHttpContextAccessor();
        }

        private static void AddSwagger(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Examenkompas", Version = "v1" });
            });
        }

        private void AddPersistence(IServiceCollection services)
        {
            var database = _configuration.GetValue<string>("AppSettings:database");
            if (database.Equals("mongo", StringComparison.OrdinalIgnoreCase))
            {
                services.AddMongoDbPersistence("Examenkompas", _configuration.GetConnectionString("MongoDB"),
                    new List<Type> { typeof(Examen), typeof(ExamenAnalysisMetadata), typeof(ClustersPerNiveau) });
            }
            else if (database.Equals("memory", StringComparison.OrdinalIgnoreCase))
            {
                services.AddInMemoryPersistence();
            }
            else
            {
                throw new Exception("Unknown database type define in AppSettings:database");
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseDefaultFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseResponseCompression();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHttpsRedirection();
            var rewriteOptions = new RewriteOptions()
                .AddRewrite(@"^(?!(api|swagger)/|.*\..*).*$", "index.html", true);
            app.UseRewriter(rewriteOptions);
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }
            app.UseAnonymousId(new AnonymousIdCookieOptionsBuilder()
                .SetCustomCookieName("EXAMENKOMPAS")        // Custom cookie name
                .SetCustomCookieTimeout(60 * 60 * 24 * 365 * 2));
            //Authorization needs the route to be resolved first to decide which authorization policy applies.
            app.UseRouting();
            app.UseCors(builder =>
            {
                var corsAllowedOrigins = _configuration.GetValue<string>("AppSettings:corsAllowedOrigins")?.Split(',');
                builder.WithOrigins(corsAllowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
            app.UseEndpoints(endpoints =>
            {

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapControllers();
            });


            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Examenkompas V1"); });
        }
    }
}
