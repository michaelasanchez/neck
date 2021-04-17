using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Services
{
	public abstract class VariationService<TBase, TVariation> : IVariationService<TBase, TVariation>
		where TBase : IDbEntity
		where TVariation : IVariation<TBase>
	{
		private readonly ILogger<VariationService<TBase, TVariation>> _logger;

		protected IVariationFactory<TBase, TVariation> _factory;

		protected IRepository<TBase> _baseRepo;
		protected IRepository<Tuning> _tuningRepo;

		public VariationService(
			ILogger<VariationService<TBase, TVariation>> logger,
			IVariationFactory<TBase, TVariation> factory,
			IRepository<TBase> baseRepository,
			IRepository<Tuning> tuningRepository
			)
		{
			_logger = logger;

			_factory = factory;

			_baseRepo = baseRepository;
			_tuningRepo = tuningRepository;
		}

		public async Task<OperationResult<GenerateResponseHeader<TVariation>>> Generate(Guid baseId, Guid tuningId, int offset, int span)
		{
			var baseResult = await _baseRepo.GetById(baseId);
			if (!baseResult.Success)
			{
				return CreateFailure(baseResult);
			}

			var keysResult = await GetKeys(baseResult.Result);
			if (!keysResult.Success) {
				return CreateFailure(keysResult);
			}

			var tuningResult = await _tuningRepo.GetById(tuningId);
			if (!tuningResult.Success)
			{
				return CreateFailure(tuningResult);
			}

			var variations = _factory.GenerateVariations(baseResult.Result, tuningResult.Result, offset, span);

			return OperationResult<GenerateResponseHeader<TVariation>>.CreateSuccess(new GenerateResponseHeader<TVariation>()
			{
				BaseId = baseResult.Result.Id,
				InstrumentId = tuningResult.Result.InstrumentId,
				TuningId = tuningResult.Result.Id,
				Offset = offset,
				Span = span,
				Keys = keysResult.Result,
				Variations = variations
			});
		}

		public async Task<OperationResult<GenerateResponseHeader<TVariation>>> GenerateRange(Guid baseId, Guid tuningId, int offset, int range, int span)
		{
			var baseResult = await _baseRepo.GetById(baseId);
			if (!baseResult.Success)
			{
				return CreateFailure(baseResult);
			}

			var keysResult = await GetKeys(baseResult.Result);
			if (!keysResult.Success)
			{
				return CreateFailure(keysResult);
			}

			var tuningResult = await _tuningRepo.GetById(tuningId);
			if (!tuningResult.Success)
			{
				return CreateFailure(tuningResult);
			}

			var variations = _factory.GenerateRange(baseResult.Result, tuningResult.Result, offset, range, span);



			return OperationResult<GenerateResponseHeader<TVariation>>.CreateSuccess(new GenerateResponseHeader<TVariation>()
			{
				BaseId = baseResult.Result.Id,
				InstrumentId = tuningResult.Result.InstrumentId,
				TuningId = tuningResult.Result.Id,
				Offset = offset,
				Range = range,
				Span = span,
				Keys = keysResult.Result,
				Variations = variations
			});
		}

		protected abstract Task<OperationResult<List<Key>>> GetKeys(TBase @base);

		private OperationResult<GenerateResponseHeader<TVariation>> CreateFailure(IOperationResult result)
		{
			return OperationResult<GenerateResponseHeader<TVariation>>.CreateFailure(result.Message);
		}
	}
}
