using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Entity.Variations;

namespace neck.Controllers.DbEntity
{
    [ApiController]
	[Route("[controller]")]
	public class ChordVariationController : VariationController<Chord, ChordVariation>
	{
		private readonly ILogger<ChordVariationController> _logger;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IVariationFactory<Chord, ChordVariation> factory,
			IRepository<ChordVariation> repository,
			IRepository<Chord> baseRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(logger, factory, repository, baseRepository, tuningRepository)
		{
			_logger = logger;
		}
	}
}
