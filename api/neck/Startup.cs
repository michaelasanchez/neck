using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using neck.Factories;
using neck.Generators;
using neck.Interfaces;
using neck.Models;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using neck.Repositories;
using neck.Services;
using neck.Services.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

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

			services.AddControllers().AddNewtonsoftJson(o =>
			{
				o.SerializerSettings.ContractResolver = new DefaultContractResolver();
				o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
			});

			//services.AddMvc()
			//	.AddJsonOptions(opt => opt.JsonSerializerOptions.PropertyNamingPolicy = null);

			services.AddScoped(typeof(IRepository<Chord>), typeof(ChordRepository));
			services.AddScoped(typeof(IRepository<ChordVariation>), typeof(ChordVariationRepository));
			services.AddScoped(typeof(IRepository<Formation>), typeof(FormationRepository));
			services.AddScoped(typeof(IRepository<Instrument>), typeof(InstrumentRepository));
			services.AddScoped(typeof(IRepository<Key>), typeof(KeyRepository));
			services.AddScoped(typeof(IRepository<Note>), typeof(NoteRepository));
			services.AddScoped(typeof(IRepository<Scale>), typeof(ScaleRepository));
			services.AddScoped(typeof(IRepository<ScaleVariation>), typeof(ScaleVariationRepository));
			services.AddScoped(typeof(IRepository<Tuning>), typeof(TuningRepository));

			services.AddScoped(typeof(IKeyService), typeof(KeyService));
			services.AddScoped(typeof(IVariationService<Chord, ChordVariation>), typeof(ChordVariationService));
			services.AddScoped(typeof(IVariationService<Scale, ScaleVariation>), typeof(ScaleVariationService));

			services.AddScoped(typeof(IVariationFactory<Chord, ChordVariation>), typeof(ChordVariationFactory));
			services.AddScoped(typeof(IVariationFactory<Scale, ScaleVariation>), typeof(ScaleVariationFactory));

			services.AddDbContext<NeckContext>(options =>
				options.UseSqlServer(Configuration.GetConnectionString("NeckDatabase")));

			// Register the Swagger generator, defining 1 or more Swagger documents
			//services.AddSwaggerGen();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseHttpsRedirection();


			// Enable middleware to serve generated Swagger as a JSON endpoint.
			//app.UseSwagger();

			//// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
			//// specifying the Swagger JSON endpoint.
			//app.UseSwaggerUI(c =>
			//{
			//	c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
			//});

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
