using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Factories.Args;
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

		private ChordVariationFactory _factory;

		private IRepository<Chord> _chordRepo;
		private IRepository<Tuning> _tuningRepo;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			IFactory<ChordVariation, ChordVariationCreateArgs> factory,
			IRepository<Chord> chordRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(repository)
		{
			_logger = logger;
			_factory = (ChordVariationFactory)factory;

			_chordRepo = chordRepository;
			_tuningRepo = tuningRepository;
		}

		[HttpPost("Generate")]
		public async Task<ActionResult<List<ChordVariation>>> Generate([FromBody] ChordVariationGenerateParams @params)
		{
			var chord = @params.chord;
			if (chord == null)
			{
				var result = await _chordRepo.GetByIdAsync(@params.chordId);
				if (result.Success)
				{
					chord = result.Result;
				}
			}
			var tuning = @params.tuning;
			if (tuning == null)
			{
				var result = await _tuningRepo.GetByIdAsync(@params.tuningId);
				if (result.Success)
				{
					tuning = result.Result;
				}
			}

			if (chord == null)
			{
				return BadRequest("Chord or chordId is required");
			}
			else if (chord.Root == null)
			{
				return BadRequest("Chord root note is required");
			}
			if (tuning == null)
			{
				if (@params.tuningId == null)
				{
					return BadRequest("Tuning or tuningId is required");
				}
				else
				{
					return BadRequest("Tuning could not be found");
				}
			}

			var offset = @params.offset ?? 0;
			var span = @params.span ?? 4;

			if (span < 1)
			{
				return BadRequest("Span must be greater than zero");
			}

			return _factory.GenerateVariations(chord, tuning, offset, span);
		}

		[HttpPost("GenerateRange")]
		public async Task<ActionResult<List<ChordVariation>>> GenerateRange([FromBody] ChordVariationGenerateRangeParams @params)
		{
			var chord = @params.chord;
			if (chord == null)
			{
				var result = await _chordRepo.GetByIdAsync(@params.chordId);
				if (result.Success)
				{
					chord = result.Result;
				}
			}
			var tuning = @params.tuning;
			if (tuning == null)
			{
				var result = await _tuningRepo.GetByIdAsync(@params.tuningId);
				if (result.Success)
				{
					tuning = result.Result;
				}
			}

			if (chord == null)
			{
				return BadRequest("Chord or chordId is required");
			}
			else if (chord.Root == null)
			{
				return BadRequest("Chord root note is required");
			}
			if (tuning == null)
			{
				if (@params.tuningId == null)
				{
					return BadRequest("Tuning or tuningId is required");
				}
				else
				{
					return BadRequest("Tuning could not be found");
				}
			}

			var offset = @params.offset ?? 0;
			var span = @params.span ?? 4;
			var range = @params.range ?? 12;

			// TODO: Remove this eventually..
			List<ChordVariation> variations;
			try
			{
				variations = _factory.GenerateRange(chord, tuning, offset, range, span);
			}
			catch (Exception ex)
			{
				return BadRequest($"An error occured while generating variations: {ex}");
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
