using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using neck.Generators;
using neck.Interfaces;
using neck.Models;
using neck.Repositories;
using Newtonsoft.Json;

namespace neck
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		readonly string DebugPolicy = "_debug";

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddCors(options =>
			{
				options.AddPolicy(name: DebugPolicy,
					builder =>
					{
						builder.WithOrigins("http://localhost:9000")
							.AllowAnyHeader()
							.AllowAnyMethod();
					});
			});

			services.AddControllers().AddNewtonsoftJson();

			services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
			services.AddScoped(typeof(IGenerator<>), typeof(GenericGenerator<>));

			services.AddSingleton(typeof(ChordVariationGenerator));

			services.AddDbContext<NeckContext>(options =>
				options.UseSqlServer(Configuration.GetConnectionString("NeckDatabase")));
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseCors(DebugPolicy);

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
				endpoints.MapGet("/", async context =>
				{
					await context.Response.WriteAsync("Neck API running...");
				});
			});
		}
	}
}
