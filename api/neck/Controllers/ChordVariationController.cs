using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Controllers.Args;
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
			IFactory<ChordVariation> factory,
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
		public async Task<ActionResult<List<ChordVariation>>> Generate([FromBody] ChordVariationGenerateArgs args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(validateResult.Message);
			}

			var chord = args.chord;
			if (chord == null)
			{
				var result = await _chordRepo.GetById(args.chordId);
				if (result.Success)
				{
					chord = result.Result;
				}
			}
			var tuning = args.tuning;
			if (tuning == null)
			{
				var result = await _tuningRepo.GetById(args.tuningId);
				if (result.Success)
				{
					tuning = result.Result;
				}
			}

			return _factory.GenerateVariations(chord, tuning, (int)args.offset, (int)args.span);
		}

		[HttpPost("GenerateRange")]
		public async Task<ActionResult<List<ChordVariation>>> GenerateRange([FromBody] ChordVariationGenerateRangeArgs args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(validateResult.Message);
			}

			var chord = args.chord;
			if (chord == null)
			{
				var result = await _chordRepo.GetById(args.chordId);
				if (!result.Success)
				{
					return BadRequest(result.Message);
				}

				chord = result.Result;
			}
			var tuning = args.tuning;
			if (tuning == null)
			{
				var result = await _tuningRepo.GetById(args.tuningId);
				if (!result.Success)
				{
					return BadRequest(result.Message);
				}

				tuning = result.Result;
			}

			// TODO: Remove this eventually..
			List<ChordVariation> variations;
			try
			{
				variations = _factory.GenerateRange(chord, tuning, (int)args.offset, (int)args.range, (int)args.span);
			}
			catch (Exception ex)
			{
				return BadRequest($"An error occured while generating variations: {ex}");
			}

			// TODO: 
			return Ok(variations);
		}
	}
}
