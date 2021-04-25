using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Controllers.Args;
using neck.Factories.Options;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using neck.Models.Results;
using neck.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace neck.Controllers.DbEntity
{
    [ApiController]
	[Route("[controller]")]
	public class ChordVariationController : EntityController<ChordVariation>
	{
		private readonly ILogger<ChordVariationController> _logger;

		private readonly IChordVariationService _service;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			IChordVariationService service
		)
			: base(repository)
	{
			_logger = logger;

			_service = service;
		}

		[HttpPost("Generate")]
		public async Task<ActionResult<GenerateResponseHeader<ChordVariation>>> Generate([FromBody] VariationGenerateArgs<Chord> args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(new Response(validateResult));
			}

			try
			{
				var variationsResult = await _service.Generate(args.BaseId.Value, args.TuningId.Value, (int)args.Offset, (int)args.Span, options);

				if (!variationsResult.Success)
				{
					return BadRequest(new Response(variationsResult));
				}

				return Ok(variationsResult.Result);
			}
			catch (Exception ex)
			{
				return BadRequest(new Response($"An error occurred while generation variations:\n\n{ex.Message}"));
			}
		}

		[HttpPost("GenerateRange")]
		public async Task<ActionResult<GenerateResponseHeader<ChordVariation>>> GenerateRange([FromBody] VariationGenerateRangeArgs<Chord> args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(new Response(validateResult));
			}

			try
			{
				var variationsResult = await _service.GenerateRange(args.BaseId.Value, args.TuningId.Value, (int)args.Offset, (int)args.Span, (int)args.range, options);

				if (!variationsResult.Success)
				{
					return BadRequest(new Response(variationsResult));
				}

				return Ok(variationsResult.Result);
			}
			catch (Exception ex)
			{
				return BadRequest(new Response($"An error occured while generating variations:\n\n{ex.Message}"));
			}
		}
	}
}
