using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
