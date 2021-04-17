using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using neck.Models.Results;
using neck.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Services
{
	public class ChordVariationService : VariationService<Chord, ChordVariation>
	{
		protected readonly IKeyService _keyService;

		public ChordVariationService(ILogger<ChordVariationService> logger,
			IVariationFactory<Chord, ChordVariation> factory,
			IRepository<Chord> baseRepository,
			IRepository<Tuning> tuningRepository,
			IKeyService keyService)
			:
			base(logger, factory, baseRepository, tuningRepository)
		{
			_keyService = keyService;
		}

		protected async override Task<OperationResult<List<Key>>> GetKeys(Chord @base)
		{
			return await _keyService.Search(new Args.KeySearchArgs(@base.Tones));
		}
	}
}
