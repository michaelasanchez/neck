using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using neck.Models;

namespace neck.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class InstrumentController : GenericController<Instrument>
	{
		public InstrumentController(IRepository<Instrument> repository)
			: base(repository)
		{
		}
	}
}
