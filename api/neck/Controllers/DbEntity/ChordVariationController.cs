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
		public async Task<ActionResult<GenerateResponseHeader<ChordVariation>>> Generate([FromBody] ChordVariationGenerateArgs args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(new Response(validateResult));
			}

			try
			{
				// TODO: setup AutoMapper
				var options = new ChordVariationGenerateOptions
				{
					EnforceTones = args.EnforceTones.Value,
					FilterInversions = args.FilterInversions.Value,
					InsertFirstOpen = args.InsertFirstOpen.Value,
					InsertMuted = args.InsertMuted.Value,
					InsertOpen = args.InsertOpen.Value
				};

				// TODO NOW: this needs a validator to pass options without nullable types
				var variationsResult = await _service.Generate(args.BaseId.Value, args.TuningId.Value, (int)args.Offset, (int)args.Span, (int)args.Range, options);

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
	}
}
