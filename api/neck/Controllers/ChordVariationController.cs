using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models;

namespace neck.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ChordVariationController : VariationController<Chord, ChordVariation>
	{
		private readonly ILogger<ChordVariationController> _logger;

		private IVariationFactory<Chord, ChordVariation> _factory;

		private IRepository<Chord> _baseRepo;
		private IRepository<Tuning> _tuningRepo;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IVariationFactory<Chord, ChordVariation> factory,
			IRepository<ChordVariation> repository,
			IRepository<Chord> baseRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(logger, factory, repository, baseRepository, tuningRepository)
		{
			_logger = logger;
			_factory = factory;

			_baseRepo = baseRepository;
			_tuningRepo = tuningRepository;
		}

		//[HttpPost("Generate")]
		//public async Task<ActionResult<List<ChordVariation>>> Generate([FromBody] ChordVariationGenerateArgs args)
		//{
		//	var validateResult = args.Validate();
		//	if (!validateResult.Success)
		//	{
		//		return BadRequest(validateResult.Message);
		//	}

		//	var chord = args.@base;
		//	if (chord == null)
		//	{
		//		var result = await _chordRepo.GetById(args.baseId);
		//		if (result.Success)
		//		{
		//			chord = result.Result;
		//		}
		//	}
		//	var tuning = args.tuning;
		//	if (tuning == null)
		//	{
		//		var result = await _tuningRepo.GetById(args.tuningId);
		//		if (result.Success)
		//		{
		//			tuning = result.Result;
		//		}
		//	}

		//	return _factory.GenerateVariations(chord, tuning, (int)args.offset, (int)args.span);
		//}

		//[HttpPost("GenerateRange")]
		//public async Task<ActionResult<List<ChordVariation>>> GenerateRange([FromBody] VariationGenerateRangeArgs<Chord> args)
		//{
		//	var validateResult = args.Validate();
		//	if (!validateResult.Success)
		//	{
		//		return BadRequest(validateResult.Message);
		//	}

		//	var chord = args.@base;
		//	if (chord == null)
		//	{
		//		var result = await _chordRepo.GetById(args.baseId);
		//		if (!result.Success)
		//		{
		//			return BadRequest(result.Message);
		//		}

		//		chord = result.Result;
		//	}
		//	var tuning = args.tuning;
		//	if (tuning == null)
		//	{
		//		var result = await _tuningRepo.GetById(args.tuningId);
		//		if (!result.Success)
		//		{
		//			return BadRequest(result.Message);
		//		}

		//		tuning = result.Result;
		//	}

		//	// TODO: Remove this eventually..
		//	List<ChordVariation> variations;
		//	try
		//	{
		//		variations = _factory.GenerateRange(chord, tuning, (int)args.offset, (int)args.range, (int)args.span);
		//	}
		//	catch (Exception ex)
		//	{
		//		return BadRequest($"An error occured while generating variations: {ex}");
		//	}

		//	// TODO: 
		//	return Ok(variations);
		//}
	}
}
