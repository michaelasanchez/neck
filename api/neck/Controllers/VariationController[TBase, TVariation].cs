using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Controllers.Args;
using neck.Interfaces;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Controllers
{
	public abstract class VariationController<TBase, TVariation> : GenericController<TVariation>
		where TBase : IDbEntity
		where TVariation : IVariation<TBase>
	{
		private readonly ILogger<VariationController<TBase, TVariation>> _logger;

		protected IVariationFactory<TBase, TVariation> _factory;

		protected IRepository<TBase> _baseRepo;
		protected IRepository<Models.Tuning> _tuningRepo;

		public VariationController(
			ILogger<VariationController<TBase, TVariation>> logger,
			IVariationFactory<TBase, TVariation> factory,
			IRepository<TVariation> repository,
			IRepository<TBase> baseRepository,
			IRepository<Models.Tuning> tuningRepository
		)
			: base(repository)
		{
			_logger = logger;

			_factory = factory;

			_baseRepo = baseRepository;
			_tuningRepo = tuningRepository;
		}

		[HttpPost("Generate")]
		public async Task<ActionResult<GenerateResponseHeader<TVariation>>> Generate([FromBody] VariationGenerateArgs<TBase> args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(new Response(validateResult));
			}

			var offset = (int)args.offset;
			var span = (int)args.span;

			var baseResult = await locateBase(args);
			if (!baseResult.Success)
			{
				return BadRequest(new Response(baseResult));
			}

			var @base = baseResult.Result;

			var tuningResult = await locateTuning(args);
			if (!tuningResult.Success)
			{
				return BadRequest(new Response(tuningResult));
			}

			var tuning = tuningResult.Result;

			try
			{
				var variations = _factory.GenerateVariations(@base, tuning, offset, span);

				return Ok(new GenerateResponseHeader<TVariation>()
				{
					BaseId = @base.Id,
					InstrumentId = tuning.InstrumentId,
					TuningId = tuning.Id,
					Offset = offset,
					Span = span,
					Variations = variations
				});
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

			var offset = (int)args.offset;
			var range = (int)args.range;
			var span = (int)args.span;

			var baseResult = await locateBase(args);
			if (!baseResult.Success)
			{
				return BadRequest(new Response(baseResult));
			}

			var @base = baseResult.Result;

			var tuningResult = await locateTuning(args);
			if (!tuningResult.Success)
			{
				return BadRequest(new Response(tuningResult));
			}

			var tuning = tuningResult.Result;

			try
			{
				var variations = _factory.GenerateRange(@base, tuning, offset, range, span);

				return Ok(new GenerateResponseHeader<TVariation>()
				{
					BaseId = @base.Id,
					InstrumentId = tuning.InstrumentId,
					TuningId = tuning.Id,
					Offset = offset,
					Range = range,
					Span = span,
					Variations = variations
				});
			}
			catch (Exception ex)
			{
				return BadRequest(new Response($"An error occured while generating variations:\n\n{ex.Message}"));
			}
		}

		#region Private Methods

		private async Task<OperationResult<TBase>> locateBase(VariationGenerateArgs<TBase> args)
		{
			var @base = args.@base;
			if (@base == null)
			{
				var result = await _baseRepo.GetById(args.baseId);
				if (!result.Success)
				{
					// TODO: Should we still check if @base exists?
					return result;
				}

				@base = result.Result;
			}
			else
			{
				var result = await _baseRepo.GetOrCreate(args.@base);
				if (!result.Success)
				{
					return result;
				}

				@base = result.Result;
			}

			if (@base == null)
			{
				return OperationResult<TBase>.CreateFailure("Failed to locate chord");
			}

			return OperationResult<TBase>.CreateSuccess(@base);
		}

		private async Task<OperationResult<Models.Tuning>> locateTuning(VariationGenerateArgs<TBase> args)
		{
			var tuning = args.tuning;
			if (tuning == null)
			{
				var result = await _tuningRepo.GetById(args.tuningId);
				if (!result.Success)
				{
					return OperationResult<Models.Tuning>.CreateFailure($"Failed to locate tuning with id {args.tuningId}");
				}

				tuning = result.Result;
			}

			if (tuning == null)
			{
				return OperationResult<Models.Tuning>.CreateFailure("Failed to locate Tuning");
			}

			return OperationResult<Models.Tuning>.CreateSuccess(tuning);
		}

		#endregion
	}
}