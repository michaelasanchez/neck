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
	public class ScaleVariationController : VariationController<Scale, ScaleVariation>
	{
		private readonly ILogger<ScaleVariationController> _logger;

		public ScaleVariationController(
			ILogger<ScaleVariationController> logger,
			IRepository<ScaleVariation> repository,
			IVariationService<Scale, ScaleVariation> service
		)
			: base(logger, repository, service)
		{
			_logger = logger;
		}
	}
}
