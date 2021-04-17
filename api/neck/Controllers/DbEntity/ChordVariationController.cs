using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using neck.Services.Interfaces;

namespace neck.Controllers.DbEntity
{
    [ApiController]
	[Route("[controller]")]
	public class ChordVariationController : VariationController<Chord, ChordVariation>
	{
		private readonly ILogger<ChordVariationController> _logger;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			IVariationService<Chord, ChordVariation> service
		)
			: base(logger, repository, service)
		{
			_logger = logger;
		}
	}
}
