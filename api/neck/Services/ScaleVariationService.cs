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
	public class ScaleVariationService : VariationService<Scale, ScaleVariation>
	{
		protected readonly IKeyService _keyService;

		public ScaleVariationService(ILogger<ScaleVariationService> logger,
			IVariationFactory<Scale, ScaleVariation> factory,
			IRepository<Scale> baseRepository,
			IRepository<Tuning> tuningRepository,
			IKeyService keyService)
			:
			base(logger, factory, baseRepository, tuningRepository)
		{
			_keyService = keyService;
		}

		protected async override Task<OperationResult<List<Key>>> GetKeys(Scale @base)
		{
			return await _keyService.Search(new Args.KeySearchArgs(@base.Notes));
		}
	}
}
