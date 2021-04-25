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
	public class ScaleVariationController : EntityController<ScaleVariation>
	{
		private readonly ILogger<ScaleVariationController> _logger;

		private readonly IScaleVariationService _service;

		public ScaleVariationController(
			ILogger<ScaleVariationController> logger,
			IRepository<ScaleVariation> repository,
			IScaleVariationService service
		)
			: base(repository)
		{
			_logger = logger;

			_service = service;
			_logger = logger;
		}

		[HttpPost("Generate")]
		public async Task<ActionResult<GenerateResponseHeader<ScaleVariation>>> Generate([FromBody] VariationGenerateArgs<Scale> args, [FromBody] ScaleVariationGenerateOptions options)
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
		public async Task<ActionResult<GenerateResponseHeader<ScaleVariation>>> GenerateRange([FromBody] VariationGenerateRangeArgs<Scale> args, [FromBody] ScaleVariationGenerateOptions options)
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
