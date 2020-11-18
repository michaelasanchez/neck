using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
    public class ChordVariationController : ControllerBase
    {
        private readonly ILogger<ChordVariationController> _logger;

        public ChordVariationController(ILogger<ChordVariationController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public List<ChordVariation> Get(ChordVariationGetParams getParams)
        {
            return ChordVariationRepository.Generate(getParams.chord, getParams.tuning, 0, 4);
        }
    }

    public class ChordVariationGetParams
    {
        public Chord chord;
        public Tuning tuning;
    }
}
