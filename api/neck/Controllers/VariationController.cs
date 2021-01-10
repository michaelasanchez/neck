using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Controllers.Args;
using neck.Interfaces;
using neck.Interfaces.Args;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers
{
	public class VariationController<TBase, TVariation> : GenericController<TVariation>
		where TVariation : IVariation<TBase>
	{
		private readonly ILogger<VariationController<TBase, TVariation>> _logger;

		private IVariationFactory<TBase, TVariation> _factory;

		private IRepository<TBase> _baseRepo;
		private IRepository<Tuning> _tuningRepo;

		public VariationController(
			ILogger<VariationController<TBase, TVariation>> logger,
			IVariationFactory<TBase, TVariation> factory,
			IRepository<TVariation> repository,
			IRepository<TBase> baseRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(repository)
		{
			_logger = logger;

			_factory = factory;

			_baseRepo = baseRepository;
			_tuningRepo = tuningRepository;
		}

		[HttpPost("Generate")]
		public async Task<ActionResult<List<ChordVariation>>> Generate([FromBody] VariationGenerateArgs<TBase> args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(validateResult.Message);
			}

			var @base = args.@base;
			if (@base == null)
			{
				var result = await _baseRepo.GetById(args.baseId);
				if (result.Success)
				{
					@base = result.Result;
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

			return Ok(_factory.GenerateVariations(@base, tuning, (int)args.offset, (int)args.span));
		}

		[HttpPost("GenerateRange")]
		public async Task<ActionResult<List<ChordVariation>>> GenerateRange([FromBody] VariationGenerateRangeArgs<TBase> args)
		{
			var validateResult = args.Validate();
			if (!validateResult.Success)
			{
				return BadRequest(validateResult.Message);
			}

			var @base = args.@base;
			if (@base == null)
			{
				var result = await _baseRepo.GetById(args.baseId);
				if (!result.Success)
				{
					return BadRequest(result.Message);
				}

				@base = result.Result;
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
			List<TVariation> variations;
			try
			{
				variations = _factory.GenerateRange(@base, tuning, (int)args.offset, (int)args.range, (int)args.span);
			}
			catch (Exception ex)
			{
				return BadRequest($"An error occured while generating variations: {ex}");
			}

			return Ok(variations);
		}
	}
}