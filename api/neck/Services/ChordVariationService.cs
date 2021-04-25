using Microsoft.Extensions.Logging;
using neck.Factories.Interfaces;
using neck.Factories.Options;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using neck.Models.Results;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Services
{
	public class ChordVariationService : VariationService<Chord, ChordVariation>, IChordVariationService
	{
		private readonly IKeyService _keyService;

		private readonly IChordVariationFactory _factory;

		public ChordVariationService(ILogger<ChordVariationService> logger,
			IRepository<Chord> baseRepository,
			IRepository<Tuning> tuningRepository,
			IKeyService keyService,
			IChordVariationFactory factory)
			:
			base(logger, baseRepository, tuningRepository)
		{
			_keyService = keyService;
			_factory = factory;
		}

		protected async override Task<OperationResult<List<Key>>> GetKeys(Chord @base)
		{
			return await _keyService.Search(new Args.KeySearchArgs(@base.Tones));
		}

		public async Task<OperationResult<GenerateResponseHeader<ChordVariation>>> Generate(Guid baseId, Guid tuningId, int offset, int span, int range, ChordVariationGenerateOptions options)
		{
			var baseResult = await _baseRepo.GetById(baseId);
			if (!baseResult.Success)
			{
				return CreateFailure(baseResult);
			}

			var tuningResult = await _tuningRepo.GetById(tuningId);
			if (!tuningResult.Success)
			{
				return CreateFailure(tuningResult);
			}

			var keysResult = await GetKeys(baseResult.Result);
			if (!keysResult.Success)
			{
				return CreateFailure(keysResult);
			}

			var variations = _factory.Generate(baseResult.Result, tuningResult.Result, offset, span, range, options);

			return OperationResult<GenerateResponseHeader<ChordVariation>>.CreateSuccess(new GenerateResponseHeader<ChordVariation>()
			{
				BaseId = baseResult.Result.Id,
				InstrumentId = tuningResult.Result.InstrumentId,
				TuningId = tuningResult.Result.Id,
				Offset = offset,
				Span = span,
				Range = range,
				Keys = keysResult.Result,
				Variations = variations
			});
		}
	}
}
