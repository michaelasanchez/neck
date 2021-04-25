//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Logging;
//using neck.Controllers.Args;
//using neck.Interfaces;
//using neck.Models.Entity;
//using neck.Models.Results;
//using neck.Services.Interfaces;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace neck.Controllers
//{
//    public abstract class VariationController<TBase, TVariation, TOptions> : EntityController<TVariation>
//		where TBase : IDbEntity
//		where TVariation : IVariation<TBase>
//	{
//		private readonly ILogger<VariationController<TBase, TVariation, TOptions>> _logger;

//		protected readonly IScaleVariationService<TBase, TVariation> _service;

//		public VariationController(
//			ILogger<VariationController<TBase, TVariation, TOptions>> logger,
//			IRepository<TVariation> repository,
//			IScaleVariationService<TBase, TVariation> service
//		)
//			: base(repository)
//		{
//			_logger = logger;
//			_service = service;
//		}

//		[HttpPost("Generate")]
//		public async Task<ActionResult<GenerateResponseHeader<TVariation>>> Generate([FromBody] VariationGenerateArgs<TBase> args)
//		{
//			var validateResult = args.Validate();
//			if (!validateResult.Success)
//			{
//				return BadRequest(new Response(validateResult));
//			}

//			try
//			{
//				var variationsResult = await _service.Generate(args.BaseId.Value, args.TuningId.Value, (int)args.Offset, (int)args.Span);

//				if (!variationsResult.Success)
//				{
//					return BadRequest(new Response(variationsResult));
//				}

//				return Ok(variationsResult.Result);
//			}
//			catch (Exception ex)
//			{
//				return BadRequest(new Response($"An error occurred while generation variations:\n\n{ex.Message}"));
//			}
//		}

//		[HttpPost("GenerateRange")]
//		public async Task<ActionResult<GenerateResponseHeader<TVariation>>> GenerateRange([FromBody] VariationGenerateRangeArgs<TBase> args, [FromBody] TOptions options)
//		{
//			var validateResult = args.Validate();
//			if (!validateResult.Success)
//			{
//				return BadRequest(new Response(validateResult));
//			}

//			try
//			{
//				var variationsResult = await _service.GenerateRange(args.BaseId.Value, args.TuningId.Value, (int)args.Offset, (int)args.Span, (int)args.range, options);

//				if (!variationsResult.Success)
//				{
//					return BadRequest(new Response(variationsResult));
//				}

//				return Ok(variationsResult.Result);
//			}
//			catch (Exception ex)
//			{
//				return BadRequest(new Response($"An error occured while generating variations:\n\n{ex.Message}"));
//			}
//		}
//	}
//}