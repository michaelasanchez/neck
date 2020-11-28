using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Generators;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace neck.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ChordVariationController : GenericController<ChordVariation>
	{
		private readonly ILogger<ChordVariationController> _logger;

		private readonly ChordVariationGenerator _generator;

		private IRepository<Chord> _chordRepo;
		private IRepository<Tuning> _tuningRepo;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			IGenerator<ChordVariation> generator,
			IRepository<Chord> chordRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(repository)
		{
			_logger = logger;
			_generator = (ChordVariationGenerator)generator;

			_chordRepo = chordRepository;
			_tuningRepo = tuningRepository;
		}

		[HttpPost]
		[Route("generate")]
		public async Task<List<ChordVariation>> Generate([FromBody] ChordVariationGenerateParams @params)
		{
			var chord = @params.chord ?? await _chordRepo.GetAsync(@params.chordId);
			var tuning = @params.tuning ?? await _tuningRepo.GetAsync(@params.tuningId);

			if (chord == null || tuning == null)
			{
				return new List<ChordVariation>();
			}

			var offset = @params.offset ?? 0;
			var span = @params.span ?? 4;

			return _generator.GenerateVariations(chord, tuning, offset, span);
		}

		[HttpPost]
		[Route("generaterange")]
		public async Task<ActionResult<List<ChordVariation>>> GenerateRange([FromBody] ChordVariationGenerateRangeParams @params)
		{
			var chord = @params.chord ?? await _chordRepo.GetAsync(@params.chordId);
			var tuning = @params.tuning ?? await _tuningRepo.GetAsync(@params.tuningId);

			if (chord == null) return BadRequest("Chord or chordId is required");
			if (tuning == null) return BadRequest("Tuning or tuningId is required");

			var range = @params.range ?? 12;
			var offset = @params.offset ?? 0;
			var span = @params.span ?? 4;

			// TODO: Remove this eventually..
			List<ChordVariation> variations;
			try
			{
				variations = _generator.GenerateRange(chord, tuning, offset, range, span);
			}
			catch (Exception ex)
			{
				Debug.WriteLine(ex.ToString());
				return BadRequest($"An error occured while generating variations: {ex.ToString()}");
			}

			// TODO: 
			return Ok(variations);
		}
	}

	public class ChordVariationGenerateParams
	{
		public Guid? chordId;
		public Guid? tuningId;
		public Chord chord;
		public Tuning tuning;
		public int? offset;
		public int? span;
	}

	public class ChordVariationGenerateRangeParams : ChordVariationGenerateParams
	{
		public int? range;
	}
}
