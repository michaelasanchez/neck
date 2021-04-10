using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using neck.Models.Entity;

namespace neck.Controllers.DbEntity
{
    [ApiController]
	[Route("[controller]")]
	public class InstrumentController : EntityController<Instrument>
	{
		public InstrumentController(IRepository<Instrument> repository)
			: base(repository)
		{
		}
	}
}
