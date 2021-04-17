using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Controllers.Args;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Controllers
{
    public abstract class VariationController<TBase, TVariation> : EntityController<TVariation>
		where TBase : IDbEntity
		where TVariation : IVariation<TBase>
	{
		private readonly ILogger<VariationController<TBase, TVariation>> _logger;

		protected readonly IVariationService<TBase, TVariation> _service;

		public VariationController(
			ILogger<VariationController<TBase, TVariation>> logger,
			IRepository<TVariation> repository,
			IVariationService<TBase, TVariation> service
		)
			: base(repository)
		{
			_logger = logger;
			_service = service;
		}

		[HttpPost("Generate")]
		public async Task<ActionResult<GenerateResponseHeader<TVariation>>> Generate([FromBody] VariationGenerateArgs<TBase> args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(new Response(validateResult));
			}

			try
			{
				var variationsResult = await _service.Generate(args.baseId.Value, args.tuningId.Value, (int)args.offset, (int)args.span);

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
		public async Task<ActionResult<GenerateResponseHeader<TVariation>>> GenerateRange([FromBody] VariationGenerateRangeArgs<TBase> args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(new Response(validateResult));
			}

			try
			{
				var variationsResult = await _service.GenerateRange(args.baseId.Value, args.tuningId.Value, (int)args.offset, (int)args.range, (int)args.span);

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