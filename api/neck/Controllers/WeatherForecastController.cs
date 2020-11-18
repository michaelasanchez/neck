using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Models;
using neck.Models.Db;
using neck.Repositories;

namespace neck.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private NeckContext _context;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, NeckContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var chord = new Chord(Note.C(), Enums.ChordEnums.ChordModifier.Major);
            var tuning = Tuning.Standard();

            var test = new Note(Enums.NoteValue.B);
            var half = test.HalfStepUp();
            var whole = test.WholeStepUp();

            var poop = ChordVariationRepository.Generate(chord, tuning, 0, 4);

            var holymoly = _context.ChordVariations.Add(poop[2]);
            _context.SaveChanges();

            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
