using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models;
using neck.Models.Db;
using neck.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChordVariationController : GenericController<ChordVariation>
    {
        private readonly ILogger<ChordVariationController> _logger;

        public ChordVariationController(ILogger<ChordVariationController> logger, IRepository<ChordVariation> repository)
            : base(repository)
        {
            _logger = logger;
        }

        [HttpPost]
        public List<ChordVariation> Generate([FromBody] ChordVariationGetParams getParams)
        {
            var chord = getParams.chord ?? new Chord(Note.C(), Enums.ChordEnums.ChordModifier.Major);
            var tuning = getParams.tuning ?? Tuning.Standard();

            return ((ChordVariationRepository)_repository).Generate(chord, tuning, 0, 4);
        }
    }

    public class ChordVariationGetParams
    {
        public Chord chord;
        public Tuning tuning;
    }
}
