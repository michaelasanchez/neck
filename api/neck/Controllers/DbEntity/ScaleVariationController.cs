using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Entity.Variations;

namespace neck.Controllers.DbEntity
{

    [ApiController]
	[Route("[controller]")]
	public class ScaleVariationController : VariationController<Scale, ScaleVariation>
	{
		private readonly ILogger<ScaleVariationController> _logger;

		public ScaleVariationController(
			ILogger<ScaleVariationController> logger,
			IVariationFactory<Scale, ScaleVariation> factory,
			IRepository<ScaleVariation> repository,
			IRepository<Scale> baseRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(logger, factory, repository, baseRepository, tuningRepository)
		{
			_logger = logger;
		}
	}
}
