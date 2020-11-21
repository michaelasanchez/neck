using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Generators;
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

		private readonly ChordVariationGenerator _generator;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			ChordVariationGenerator generator
		)
			: base(repository)
		{
			_logger = logger;
			_generator = generator;
		}

		[HttpPost("{controller}/generate")]
		public List<ChordVariation> Generate([FromBody] ChordVariationGetParams getParams)
		{
			if (getParams.chord == null || getParams.tuning == null)
			{
				return new List<ChordVariation>();
			}

			var offset = getParams.offset ?? 0;
			var span = getParams.span ?? 4;

			return _generator.GenerateInRange(getParams.chord, getParams.tuning, offset, span);
		}
	}

	public class ChordVariationGetParams
	{
		public Chord chord;
		public Tuning tuning;
		public int? offset;
		public int? span;
	}
}
